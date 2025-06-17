---
title: '使用LoCyanFrp进行内网穿透搭建自己的云盘'
published: 2025-04-22
description: ''
image: ''
tags: [Frp]
category: TEC
draft: false
---

test

:::tip
原文地址：https://rimrose.top/NAT_Traversal_LoCyanFrp/
:::

## 前情提要

由于上一篇文章里我已经搭建好了一个适合我网络环境的番剧自动下载流程，所以下一步自然是要考虑如何快速便捷地访问我下载的内容。

我一开始想的是用 SakuraFrp，不过虽然它的免费版本有 10Mbps 的网速，播 1080p 的动漫来说应该是绰绰有余，但是它免费流量只有 10GB，对于在线播放视频来说还是太少了。

![10GiB免费流量](https://img.rimrose.work/20250422190108124.png)

然后昨天水群的时候问了一句，有个群友给我推荐了 LoCyanFrp：

## LoCyanFrp

[LoCyanFrp官网](https://www.locyanfrp.cn/)

我点开一看——握草，不限速，而且每天签到 1000~4000GB 流量？这个乐青映射是什么来头？再一看，他们的服务器都是捐赠来的，那我只好玩儿了命地免费用了，非常非常感谢这些服务器的捐赠者，你们简直就是神

![这签到无敌了](https://img.rimrose.work/20250423004626316.png)

![看到服务器介绍里的“捐赠”二字，肃然起敬](https://img.rimrose.work/20250422190708018.png)

使用方法很简单，点进上边的官网去注册一个账号，然后通过两级实名认证就能用了（实测我只通过二级认证会无法使用）

![基本相当于不限速不限流量](https://img.rimrose.work/20250422191433013.png)

## 云盘

关于 Alist 的安装与使用，请移步 [Alist 官方文档](https://alist.nn.ci/zh/)

Alist 默认是运行在 5244 端口上的，要将 Alist 暴露到公网，穿透协议选 HTTP，本地端口写 5244 就可以了，但是记得在选服务器的时候选支持大流量和建站的

![](https://img.rimrose.work/20250422192727784.png)

![](https://img.rimrose.work/20250422192528985.png)

由于文档里没作说明，所以以防万一你忘记，记得在用 http 协议穿透的时候给你的自定义域名添加 CNAME 记录，指向你用的那个服务器的域名

![](https://img.rimrose.work/20250422193047754.png)

关于 https，我试了一下，不知道该怎么设置证书，所以暂时只用了 http 协议来穿透 Alist

## 进行穿透

软件下载目录在这里：https://dashboard.locyanfrp.cn/other/software

最简单的办法是下载`Nya LoCyanFrp! 乐青映射启动器`软件进行使用

如果是 linux，可以下载`纯净版客户端 (Frpc)`，然后：

![](https://img.rimrose.work/20250422193428131.png)

如果你和我一样在用 termux，可以用这个：[点击下载 TermuxFrp](https://mrdan.lanzn.com/i4XUM2u6o5ve)

下载解压之后记得先执行：

```bash
chmod +x ./frpc
```

然后和linux一样用简易启动命令就行了

## 关于https

在使用 LoCyanFrp 穿透 Alist 的时候，如果想开启 https，需要在 LoCyanFrp 的隧道设置里把需要开启 https 的隧道改成使用 https 协议穿透，并且需要在 Alist 的 `config.json` 里进行设置，具体可以参考 [Alist文档：配置文件](https://alistgo.com/zh/config/configuration.html#scheme)，然后把设置好的 https 端口在隧道配置里也写好

但是有一个问题，Alist 开启 https 之后，文件加载速度会变得特别慢，尤其是视频

并且还有一点，手机上直接（通过apk文件）装的 Alist 是无法正确开启 https 的，即使你把配置文件写好也是没用的