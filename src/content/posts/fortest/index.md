---
title: 'title'
published: 2025-09-22
description: 'just for test'
image: ''
tags: []
category: 'TEC'
draft: false
---

111

```powershell title="name" in
# 要监控的文件夹
$watchFolder = "D:\Export\HDR"

# 创建文件系统监控器
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchFolder
$watcher.Filter = "*.png"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

Write-Host "👀 正在监控 $watchFolder ，新 PNG 会自动转换为 AVIF..."

# 定义检查文件是否完成写入的函数
function Wait-ForFileReady($filePath, $timeoutSec=30) {
    $lastSize = -1
    $stableCount = 0
    $elapsed = 0

    while ($elapsed -lt $timeoutSec) {
        if (Test-Path $filePath) {
            $size = (Get-Item $filePath).Length
            if ($size -eq $lastSize -and $size -gt 0) {
                $stableCount++
                if ($stableCount -ge 2) { return $true } # 连续2次大小不变
            } else {
                $stableCount = 0
            }
            $lastSize = $size
        }
        Start-Sleep -Seconds 2
        $elapsed += 2
    }
    return $false
}

# 定义处理逻辑
$action = {
    param($source, $eventArgs)

    $inputPath  = $eventArgs.FullPath
    $outputPath = [System.IO.Path]::ChangeExtension($inputPath, ".avif")

    Write-Host "▶️ 检测到新文件: $inputPath"
    Write-Host "    等待文件写入完成..."

    if (-not (Wait-ForFileReady $inputPath)) {
        Write-Host "❌ 文件未能在超时时间内完成写入，跳过: $inputPath"
        return
    }

    Write-Host "    开始转换为 AVIF..."

    ffmpeg -y -i "$inputPath" `
        -pix_fmt yuv444p10le `
        -color_primaries bt2020 `
        -color_trc smpte2084 `
        -colorspace bt2020nc `
        -c:v libaom-av1 `
        -cpu-used 4 `
        -still-picture 1 `
        -crf 18 -b:v 0 `
        "$outputPath"

    if (Test-Path $outputPath) {
        Write-Host "✅ 转换完成: $outputPath"
    } else {
        Write-Host "❌ 转换失败: $inputPath"
    }
}

# 绑定事件
Register-ObjectEvent $watcher Created -Action $action

# 保持脚本运行
while ($true) { Start-Sleep -Seconds 2 }
```