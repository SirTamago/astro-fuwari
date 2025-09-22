---
title: 博客迁移
published: 2025-04-18
description: "尝试从 Hexo 迁移到了 Astro"
image: ''
tags: [Math]
category: TEC
draft: false
---

:::note
主站点：https://rimrose.top
:::

其实最主要的原因是我不想改原站点的域名，而这个`.top`域名在b站简介里是过不了审的，不知道为什么，把现在这个`.work`域名的网站填进去倒是可行，所以就想着再建一个blog

并且由于我一直觉得我原本的那个博客有些臃肿（对于我一开始用的1Mbps服务器来说还是太夸张了），所以一直有考虑换一个架构，然后看到了 Astro 有群岛架构，加载新页面的时候可以不用整个网页都重新加载，非常适合做 blog，于是就尝试迁移到这上边了。不过原站点的东西其实还是很多的，也不太舍得直接换，所以就先只把文章复制过来了。

## 对 Fuwari 的修改

- [给 Fuwari 添加友链页面](https://www.lapis.cafe/posts/technicaltutorials/%E6%96%B0%E4%B8%80%E4%BB%A3%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E6%A1%86%E6%9E%B6astro%E7%9A%84%E9%83%A8%E7%BD%B2%E4%BC%98%E5%8C%96%E6%8C%87%E5%8D%97%E4%B8%8E%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C/)

- [给你的 Fuwari 接入 Twikoo 评论](https://blog.qqquq.com/posts/fuwari-twikoo-comments/)

- 添加图片标题

    参考：[Fuwari 功能增强 Episode1 - 幽々子](https://iuuko.com/posts/tinker/fuwari-enhance-ep1/)


- Bangumi收藏

    参考：[Fuwari 功能增强 Episode2 - 幽々子](https://iuuko.com/posts/tinker/fuwari-enhance-ep2/)


## 代办

- [](https://aulypc1.github.io/posts/website/some_writing_and_functional_grammar/)

- 禁用图像优化（这个还没鼓捣明白）

    [禁用Astro跟弱智一般的静态构建图像优化 - 二叉树树](https://2x.nz/posts/disable-astro-generating-optimized-images/)

- [](https://ikamusume7.org/posts/frontend/code_block_ex/)

- [](https://ikamusume7.org/posts/frontend/some_small_code_changes/)