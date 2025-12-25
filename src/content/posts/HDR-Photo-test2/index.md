---
title: 'jxr 格式转换为 avif 的一种方法'
published: 2025-12-26
description: ''
image: ''
tags: []
category: 'TEC'
draft: false
series: '博客相关'
---


让 Gemini 写了一个脚本，可以把 jxr 格式的图片转换为 avif 格式的图片。

由于 jxr 的格式比较特殊，所以需要一个脚本来转换成 png 格式，然后再用 ffmpeg 转换成 avif 格式。

::github{repo="ledoge/jxr_to_png"}

```powershell title="converter.ps1"
# ================= 配置区 =================
# 请修改为你的实际路径
$watchFolder = "YourFolderPathHere"
$ffmpegPath = "ffmpeg" 
$ffprobePath = "ffprobe"
# 确保 jxr_to_png.exe 和脚本在一起，或者填写绝对路径
$jxrToolPath = ".\jxr_to_png.exe" 

$supportedExts = @(".png", ".jpg", ".jpeg", ".jxr", ".tif", ".tiff")
# ==========================================

function Global:Test-IsFileLocked($filePath) {
    $fileInfo = New-Object System.IO.FileInfo $filePath
    try {
        $stream = $fileInfo.Open([System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::None)
        if ($stream) { $stream.Close() }
        return $false
    } catch { return $true }
}

function Global:Wait-ForFileRelease($filePath, $timeoutSec=60) {
    $elapsed = 0
    while ($elapsed -lt $timeoutSec) {
        if (-not (Test-IsFileLocked $filePath)) { return $true }
        # 只有在真的等待时才打印，避免刷屏
        if ($elapsed % 4 -eq 0) { Write-Host "⏳ 等待文件释放... ($elapsed s)" -ForegroundColor DarkGray }
        Start-Sleep -Seconds 2
        $elapsed += 2
    }
    return $false
}

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchFolder
$watcher.Filter = "*.*" 
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

Write-Host "👀 监控启动: $watchFolder" -ForegroundColor Cyan
Write-Host "🔧 模式: 智能防死循环版 (忽略 .temp.png)" -ForegroundColor Gray

$action = {
    param($source, $eventArgs)
    $inputPath  = $eventArgs.FullPath
    $fileName   = $eventArgs.Name
    $ext        = [System.IO.Path]::GetExtension($inputPath).ToLower()

    # --- 【核心修复】忽略脚本自己生成的临时文件 ---
    if ($fileName.ToLower().EndsWith(".temp.png")) { return }
    # 忽略已生成的 avif
    if ($ext -eq ".avif") { return }
    
    # 检查后缀是否在支持列表中
    if ($supportedExts -notcontains $ext) { return }

    Write-Host "`n▶️  检测到新图片: $fileName" -ForegroundColor Yellow

    if (-not (Wait-ForFileRelease $inputPath)) {
        Write-Host "❌ 超时: 文件被占用，跳过。" -ForegroundColor Red
        return
    }

    $outputPath = [System.IO.Path]::ChangeExtension($inputPath, ".avif")
    $is_hdr = $false
    $tempPng = "" 

    # --- 1. JXR 特殊处理 ---
    if ($ext -eq ".jxr") {
        Write-Host "💡 JXR 预处理中..." -ForegroundColor Magenta
        
        $tempPng = [System.IO.Path]::ChangeExtension($inputPath, ".temp.png")
        
        # 调用转换工具
        $proc = Start-Process -FilePath $jxrToolPath -ArgumentList "`"$inputPath`" `"$tempPng`"" -PassThru -NoNewWindow -Wait
        
        if ($proc.ExitCode -eq 0 -and (Test-Path $tempPng)) {
            # 切换输入源为临时PNG，并标记为HDR
            $inputPath = $tempPng 
            $is_hdr = $true
        } else {
            Write-Host "❌ JXR 解析失败" -ForegroundColor Red
            return
        }
    } 
    # --- 2. 其他格式检测 ---
    else {
        $checkHDR = & $ffprobePath -v error -select_streams v:0 -show_entries stream=color_transfer -of default=noprint_wrappers=1:nokey=1 "$inputPath"
        if ($checkHDR -match "smpte2084" -or $checkHDR -match "arib-std-b67") { $is_hdr = $true }
        if ($ext -eq ".tif" -or $ext -eq ".tiff") { $is_hdr = $true } 
    }

    # --- 3. 转换 ---
    if ($is_hdr) {
        Write-Host "🚀 [HDR 模式] 转换中..." -ForegroundColor Magenta
        # HDR 参数
        & $ffmpegPath -y -i "$inputPath" `
            -pix_fmt yuv444p10le `
            -c:v libaom-av1 -cpu-used 4 -still-picture 1 -crf 18 -b:v 0 `
            -color_primaries bt2020 -color_trc smpte2084 -colorspace bt2020nc `
            "$outputPath" -loglevel error
    } else {
        Write-Host "🚀 [SDR 模式] 转换中..." -ForegroundColor Green
        # SDR 参数
        & $ffmpegPath -y -i "$inputPath" `
            -pix_fmt yuv420p10le `
            -c:v libaom-av1 -cpu-used 6 -still-picture 1 -crf 30 -b:v 0 `
            "$outputPath" -loglevel error
    }

    # --- 4. 清理 ---
    if ($tempPng -ne "" -and (Test-Path $tempPng)) {
        Remove-Item $tempPng -Force
        # 稍微等待一下确保文件系统释放
        Start-Sleep -Milliseconds 200
    }

    if (Test-Path $outputPath) {
        Write-Host "✅ 完成: $(Split-Path $outputPath -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "❌ 转换失败" -ForegroundColor Red
    }
}

Register-ObjectEvent $watcher Created -SourceIdentifier "FileWatcher_AVIF_V6" -Action $action | Out-Null

try {
    while ($true) { Start-Sleep -Seconds 5 }
} finally {
    Unregister-Event "FileWatcher_AVIF_V6"
    $watcher.Dispose()
    Write-Host "🛑 监控已停止"
}
```