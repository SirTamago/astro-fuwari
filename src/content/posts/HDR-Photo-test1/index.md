---
title: '关于HDR图片在不同设备和不同环境上的显示问题'
published: 2025-09-20
description: ''
image: ''
tags: []
category: 'TEC'
draft: false
series: '博客相关'
---

:::note
- 这个内容还没写完
- 我使用的图床基于 Cloudflare R2，速度可能比较慢，若出现图片加载不出来的情况请尝试多等待几秒或者直接多刷新几次
:::

## 图片效果对比



- 传到图床上的未压缩的jpg格式图片（18.4MB）

![标题五个字](https://img.rimrose.work/hdrtest-2025-09-22-01-jpg.jpg)

- 传到图床上并且压缩50%的jpg格式图片（1145KB）

![](https://img.rimrose.work/hdrtest-2025-09-22-01-jpg-compressed.jpg)



- 传到图床上的png格式图片

:::note
由于文件大小已经达到86.9MB，图床上传的时候塞不下（就算塞得下，加载也会非常慢）
:::

- 传到图床上的未压缩的avif格式图片（965KB）

![](https://img.rimrose.work/hdrtest-2025-09-22-01-avif.avif)

- 本地的avif格式图片

:::note
由于astro原生不支持avif格式，所以就没在这里放了
:::

## 个人看法

这张图是我用Lr导出的，我说的观感的标准对照组是在Lr里看到的效果

对于Lr可以导出的那几个格式（jpg、jxl、png、dng、tif、avif、psd），在我的win11搭配bandiview这个组合下，可以正确显示jxl、png的HDR效果，至于avif，我不知道为什么我的Lr导出来的avif图片会变成文件已损坏

我们针对每一个格式来说吧

- png

> png这个格式是无损的，文件体积会非常大，甚至比我拍的raw文件都大；但是它也是对的，它能在我的win11电脑上正确显示HDR效果

- jpg

> jpg本应是很好的，它用来存SDR图片时文件体积不算大，而且我用Lr导出的时候甚至可以选择文件体积不大于多少多少（我一般设的5MB）；但是在导出HDR的时候无法手动更改文件体积，如果强制选择压缩文件体积的话它会丢失HDR效果，不过相比于png的86.9MB来说，jpg的文件大小也只是png的21.17%（18.4MB）






## 写在后面

最后放一下png转avif用的脚本：

```bat filename={convert.bat}
@echo off
set input=%1
set output=%~n1.avif

ffmpeg -i "%input%" -pix_fmt yuv444p10le -color_primaries bt2020 -color_trc smpte2084 -colorspace bt2020nc -c:v libaom-av1 -cpu-used 4 -still-picture 1 -crf 18 -b:v 0 "%output%"
```