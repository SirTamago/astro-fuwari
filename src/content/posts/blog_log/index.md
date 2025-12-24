---
title: 博客迁移
published: 2025-04-18
update: 2025-12-25
description: "尝试从 Hexo 迁移到了 Astro"
image: ''
tags: [Math]
category: TEC
draft: false
series: '博客相关'
---

:::note
主站点：https://rimrose.top
:::

其实最主要的原因是我不想改原站点的域名，而这个`.top`域名在b站简介里是过不了审的，不知道为什么，把现在这个`.work`域名的网站填进去倒是可行，所以就想着再建一个blog

并且由于我一直觉得我原本的那个博客有些臃肿（对于我一开始用的1Mbps服务器来说还是太夸张了），所以一直有考虑换一个架构，然后看到了 Astro 有群岛架构，加载新页面的时候可以不用整个网页都重新加载，非常适合做 blog，于是就尝试迁移到这上边了。不过原站点的东西其实还是很多的，也不太舍得直接换，所以就先只把文章复制过来了。

## 对 Fuwari 的修改

- [给你的Fuwari添加一个友链页面](https://aulypc1.github.io/posts/website/add_friendspage_in_fuwari/)

- [给你的 Fuwari 接入 Twikoo 评论](https://blog.qqquq.com/posts/fuwari-twikoo-comments/)

- 添加图片标题

    参考：[Fuwari 功能增强 Episode1 - 幽々子](https://iuuko.com/posts/tinker/fuwari-enhance-ep1/)

- Bangumi收藏

    参考：[Fuwari 功能增强 Episode2 - 幽々子](https://iuuko.com/posts/tinker/fuwari-enhance-ep2/)

- 添加系列页面

    参考：[在Fuwari中添加系列页面 - 伊卡](https://ikamusume7.org/posts/frontend/add_series_page/)

- [增强Fuwari的代码块功能](https://ikamusume7.org/posts/frontend/code_block_ex/)

- 在 Fuwari 博客中添加图片画廊功能
  
  > 此内容由 Gemini 生成

- 调整图片大小

  [](https://ikamusume7.org/posts/frontend/some_small_code_changes2/#%E4%BA%8C%E8%B0%83%E6%95%B4%E5%9B%BE%E7%89%87%E5%A4%A7%E5%B0%8F%E6%94%B9)

## 代办

- [一些写作和功能语法](https://aulypc1.github.io/posts/website/some_writing_and_functional_grammar/)

- 禁用图像优化（这个还没鼓捣明白）

    [禁用Astro跟弱智一般的静态构建图像优化 - 二叉树树](https://2x.nz/posts/disable-astro-generating-optimized-images/)


## 一些写法

- spoiler

效果：

:spoiler[鼠标悬停此处可显示🍉]

写法：

```markdown
:spoiler[鼠标悬停此处可显示🍉]
```
<table>
  <tr>
    <td><img src="https://image.aulypc0x0.online/film/8_E100_E6/000038.webp" width=260 height="260"></td>
    <td><img src="https://image.aulypc0x0.online/film/8_E100_E6/000037.webp" width=260 height="260"></td>
    <td><img src="https://image.aulypc0x0.online/film/8_E100_E6/000036.webp" width=260 height="260"></td>
  </tr>
</table>


<div class="gallery-grid">
  <img src="https://image.aulypc0x0.online/film/8_E100_E6/000038.webp">
  <img src="https://image.aulypc0x0.online/film/8_E100_E6/000037.webp">
  <img src="https://image.aulypc0x0.online/film/8_E100_E6/000036.webp">
</div>



这里是普通的文章内容，下面是一张普通的文章插图：

![普通插图](https://image.aulypc0x0.online/film/8_E100_E6/000038.webp)

这里聊到了摄影作品，我想展示一组图，于是我用 gallery-grid 包起来：

<div class="gallery-grid">
  <img src="https://image.aulypc0x0.online/film/8_E100_E6/000038.webp">
  <img src="https://image.aulypc0x0.online/film/8_E100_E6/000037.webp">
  <img src="https://image.aulypc0x0.online/film/8_E100_E6/000036.webp">
</div>

<img src="https://image.aulypc0x0.online/film/8_E100_E6/000036.webp" width="600">

```js title="demo.js"
function demo() {

}
```
1
```text {1, 5-6} ins={2-3} del={8}
第1行
第2行
第3行
第4行
第5行
第6行
第7行
第8行
```
1
```text "c c++" ins="csharp" del="ruby"
c c++ java
javascript python csharp
rust ruby golang
```
1
```csharp collapse={4-5, 6-8} title="Demo.cs"
public int Demo()
{
  var i = 1 + 1;
1
2
  //折叠区域
  //折叠区域
  //折叠区域

  return i;
}
```

