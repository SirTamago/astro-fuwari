---
title: '在Hexo博客里放一只明日方舟小人的SpineModel'
published: 2025-03-15
description: '二次元真的是'
image: ''
tags: [record, SpineModel]
category: TEC
draft: false
---


:::tip
原文地址：https://rimrose.top/SpineModel/
:::

## 0. 前言

首先，如果你正好在使用 Hexo 博客，并且正好对明日方舟的小人模型感兴趣，想把模型放到自己的博客里，那么本文可以放心阅读。

对于其他朋友来说，大概也可以参考下边的教程来获得一部分参考。

效果预览：

![](https://img.rimrose.work/20250315225107069.png)

- 最开始是看到了这个：[在你的博客里放一只可爱的Spine Model吧](https://c10udlnk.top/p/blogsFor-hexo-puttingLivelySpineModels/)，但是当时没什么鼓捣前端的经验，跟着教程做了一遍仍然没有成功
- 后来在B站上看到了 [Ark-Pets](https://github.com/isHarryh/Ark-Pets) 项目，又激起了我的兴趣，于是又去找教程，找到了这个：[Blog 添加 2d 模型 | Weakyon Blog](https://weakyon.com/2022/08/05/blog-add-2d-model.html)，拼尽全力仍无法战胜，被 3.5.51 版本的模型击败了（我也忘了当时具体是怎么回事了）
- 一直到现在才面向 DeepSeek 并结合官方的源码里边藏的 demo 解决问题，终于能把自推放到自己的博客里了，这太酷了

下边记录一下是怎样完成的：

## 1. Spine 模型

我使用的模型是明日方舟官方的 Spine 模型，来自这个仓库：

::github{repo="isHarryh/Ark-Models"}

> 需要知道的是，这些模型的文件包含了 skel, atlas, png 三种文件，我下边的代码是基于这三个文件的。尤其是 skel 文件，由于我使用 Spine 导出的 json 无法正确导入，所以干脆就让 DeepSeek 写了一个使用 skel 文件的 Player，所以如果你没有 skel 文件的话，需要在我的代码的基础上进行修改，使用 Spine Runtime 内置的 json 读取函数

## 2. Spine 引擎

我面向 DeepSeek 写的魔改版 spine-player：

```javascript spine-player.js
// 全局配置
const spine_model_path = "path/to/spine-models/";
var MODELS = [ // 模型列表
    "model_1",
    "model_2", // 可用模型列表
];
var DEFAULT_ANIMATION = "Relax"; // 默认动画
var SKIN_NAME = "default"; // 皮肤名称
var PREMULTIPLIED_ALPHA = true; // 是否启用 Premultiplied Alpha（请注意，自《明日方舟》v2.1.41 起，新增的模型在渲染时需要禁用 Premultiplied Alpha，否则可能导致Alpha图层纹理异常。）
var NUM_SKELETONS = 1; // 渲染的骨架数量
var SCALE = 0.4; // 缩放比例
var RANDOM_MODEL = true; // 是否启用随机模型

var lastFrameTime = Date.now() / 1000;
var canvas, gl, shader, batcher, mvp, assetManager, skeletonRenderer, debugRenderer, shapes;
var skeletons = [];
var activeSkeleton; // 当前活动的骨架
var isPlayingDefaultAnimation = true; // 是否正在播放默认动画
var availableAnimations = []; // 模型支持的动作列表
var isUninterruptible = false; // 是否正在播放无法被打断的动作
var currentAnimation = DEFAULT_ANIMATION; // 当前正在播放的动作

function init() {
    canvas = document.getElementById("spine-canvas");
    canvas.width = 300;
    canvas.height = 300;

    // 初始化 WebGL 上下文
    var config = { alpha: true, premultipliedAlpha: PREMULTIPLIED_ALPHA };
    gl = canvas.getContext("webgl", config) || canvas.getContext("experimental-webgl", config);
    if (!gl) {
        alert('WebGL is unavailable.');
        return;
    }

    // 创建着色器、批处理器和 MVP 矩阵
    shader = spine.webgl.Shader.newTwoColoredTextured(gl);
    batcher = new spine.webgl.PolygonBatcher(gl);
    mvp = new spine.webgl.Matrix4();

    // 初始化渲染器和调试渲染器
    skeletonRenderer = new spine.webgl.SkeletonRenderer(gl);
    skeletonRenderer.premultipliedAlpha = PREMULTIPLIED_ALPHA; // 设置预乘 Alpha
    debugRenderer = new spine.webgl.SkeletonDebugRenderer(gl);
    debugRenderer.drawRegionAttachments = true;
    debugRenderer.drawBoundingBoxes = true;
    debugRenderer.drawMeshHull = true;
    debugRenderer.drawMeshTriangles = true;
    debugRenderer.drawPaths = true;

    // 初始化资源管理器
    assetManager = new spine.webgl.AssetManager(gl);

    // 随机选择模型
    activeSkeleton = RANDOM_MODEL ? MODELS[Math.floor(Math.random() * MODELS.length)] : MODELS[0];

    // 加载资源
    assetManager.loadBinary(spine_model_path + activeSkeleton + ".skel"); // 加载 .skel 文件
    assetManager.loadText(spine_model_path + activeSkeleton + ".atlas");
    assetManager.loadTexture(spine_model_path + activeSkeleton + ".png");

    // 添加点击事件监听器
    var widget = document.getElementById("spine-widget");
    widget.addEventListener("click", onClick);

    requestAnimationFrame(load);
}

function onClick() {
    // 如果正在播放无法被打断的动作，则忽略点击
    if (isUninterruptible) return;

    if (availableAnimations.length > 0) {
        // 过滤掉当前正在播放的动作（interact 和 special 除外）
        var availableActions = availableAnimations.filter(anim =>
            anim !== currentAnimation || anim === "interact" || anim === "special"
        );

        // 随机选择一个支持的动作
        var randomAnimation = availableActions[Math.floor(Math.random() * availableActions.length)];

        // 判断是否需要循环播放
        var shouldLoop = ["Sleep", "Sit", "Move"].includes(randomAnimation);

        // 判断是否是无法被打断的动作
        isUninterruptible = ["interact", "special"].includes(randomAnimation);

        // 切换到点击触发的动画
        for (var i = 0; i < skeletons.length; i++) {
            var state = skeletons[i].state;
            state.setAnimation(0, randomAnimation, shouldLoop); // 根据 shouldLoop 决定是否循环播放

            // 如果不是循环播放的动作，则在播放完成后回到默认动画
            if (!shouldLoop) {
                state.addAnimation(0, DEFAULT_ANIMATION, true, 0); // 播放完成后回到默认动画
            }
        }

        // 更新当前正在播放的动作
        currentAnimation = randomAnimation;
        isPlayingDefaultAnimation = false;
    }
}

function load() {
    if (assetManager.isLoadingComplete()) {
        // 加载骨架数据
        for (var i = 0; i < NUM_SKELETONS; i++) {
            var skeletonData = loadSkeleton(activeSkeleton, DEFAULT_ANIMATION, PREMULTIPLIED_ALPHA, SKIN_NAME);
            skeletons.push(skeletonData);
        }
        requestAnimationFrame(render);
    } else {
        requestAnimationFrame(load);
    }
}

function loadSkeleton(name, initialAnimation, premultipliedAlpha, skin) {
    if (skin === undefined) skin = "default";

    // 加载纹理图集
    var atlas = new spine.TextureAtlas(assetManager.get(spine_model_path + name + ".atlas"), function(path) {
        return assetManager.get(spine_model_path + path);
    });

    // 创建附件加载器
    var atlasLoader = new spine.AtlasAttachmentLoader(atlas);

    // 使用 SkeletonBinary 加载 .skel 文件
    var skeletonBinary = new spine.SkeletonBinary(atlasLoader);
    skeletonBinary.scale = SCALE; // 设置缩放比例
    var skeletonData = skeletonBinary.readSkeletonData(assetManager.get(spine_model_path + name + ".skel"));

    // 获取模型支持的动作列表
    availableAnimations = skeletonData.animations.map(anim => anim.name);

    // 检查默认动画是否存在
    if (!availableAnimations.includes(DEFAULT_ANIMATION)) {
        DEFAULT_ANIMATION = availableAnimations[0]; // 使用第一个动作作为默认动作
    }

    // 创建骨架和动画状态
    var skeleton = new spine.Skeleton(skeletonData);
    skeleton.setSkinByName(skin);
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();

    // 设置模型的初始位置
    skeleton.x = 0; // 水平居中
    skeleton.y = -100; // 向下偏移 100 像素

    var animationStateData = new spine.AnimationStateData(skeleton.data);
    var animationState = new spine.AnimationState(animationStateData);
    animationState.setAnimation(0, DEFAULT_ANIMATION, true);

    // 监听动画完成事件
    animationState.addListener({
        complete: function(entry) {
            // 如果当前动画不是循环播放的动作，则回到默认动画
            if (!["Sleep", "Sit", "Move"].includes(entry.animation.name)) {
                isPlayingDefaultAnimation = true;
                currentAnimation = DEFAULT_ANIMATION;
            }

            // 如果当前是无法被打断的动作，则重置标志
            if (["interact", "special"].includes(entry.animation.name)) {
                isUninterruptible = false;
            }
        }
    });

    // 返回骨架和动画状态
    return { skeleton: skeleton, state: animationState };
}

function render() {
    var now = Date.now() / 1000;
    var delta = now - lastFrameTime;
    lastFrameTime = now;

    // 限制 delta 的最大值，避免跳帧
    if (delta > 0.1) delta = 0.1;

    // 调整画布大小
    resize();

    // 清除画布
    gl.clearColor(0, 0, 0, 0); // 设置背景颜色
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 设置混合模式
    gl.enable(gl.BLEND);
    gl.blendFunc(PREMULTIPLIED_ALPHA ? gl.ONE : gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // 更新并渲染每个骨架
    for (var i = 0; i < skeletons.length; i++) {
        var state = skeletons[i].state;
        var skeleton = skeletons[i].skeleton;

        // 更新动画状态
        state.update(delta);
        state.apply(skeleton);
        skeleton.updateWorldTransform();

        // 绑定着色器并设置 MVP 矩阵
        shader.bind();
        shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
        shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);

        // 渲染骨架
        batcher.begin(shader);
        skeletonRenderer.draw(batcher, skeleton);
        batcher.end();

        shader.unbind();
    }

    requestAnimationFrame(render);
}

function resize() {
    var w = canvas.width;
    var h = canvas.height;

    if (canvas.width != w || canvas.height != h) {
        canvas.width = w;
        canvas.height = h;
    }

    // 更新 MVP 矩阵
    mvp.ortho2d(-(w / 2) - 20, 0 - 150, w, h);  // 这里需要根据模型的动作进行合理修改
    gl.viewport(0, 0, w, h);
}

// 初始化
init();
```

官方的 3.8 版本的 spine-webgl（太长了就不放在这儿了）：[spine-webgl.js](https://github.com/EsotericSoftware/spine-runtimes/blob/3.8/spine-ts/build/spine-webgl.js)

> 一开始参考的那篇文章的博主使用的是官方的 3.6.53 的 spine-widget.js，然而我一开始使用的模型是 Ark-Pets 项目里边使用的某个版本的模型，我已经忘了是哪个版本了，可能是 3.8，但是由于我当时没找到 3.8 的 Skeleton Viewer，所以转换成了 3.5.51 版本的，但是当时转换完之后仍然不会搞

> 最近想起来搞这个的时候，一开始我是没有任何头绪的，甚至都不知道该怎样问 AI，所以我就去看了一眼 Spine Runtime 的源码，发现在 spine-ts 的源码里边有几个 example.html，于是就把这几个 example 丢给 DeepSeek，再经过了许多次修改之后，终于写了一个基于 spine-webgl 的魔改版 spine-player

> 其实 3.8 版本有官方的 [spine-player](https://github.com/EsotericSoftware/spine-runtimes/blob/3.8/spine-ts/build/spine-player.js)，但是由于我一开始用的模型是 3.5.51 版本的，并没有对应版本的 spine-player，所以就仍然利用 spine-webgl 搞了

## 3. Hexo 注入器

相关代码：
```javascript spine-widget.js
hexo.extend.injector.register(
    'body_end', // 注入到页面 body 的末尾
    `
  <script>
    // 检测是否为移动设备
    function isMobileDevice() {
      // 通过 userAgent 检测常见的移动设备
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 如果不是移动设备，则加载 Spine 小部件
    if (!isMobileDevice()) {
      const spineWidget = document.createElement("div");
      spineWidget.id = "spine-widget";
      spineWidget.innerHTML = '<canvas id="spine-canvas"></canvas>';
      document.body.appendChild(spineWidget);

      // 动态加载 Spine 运行时库
      const spineScript = document.createElement("script");
      spineScript.src = "https://rimrose.top/spine-widget/spine-webgl.js";
      spineScript.async = true;
      spineScript.onload = function() {
        // Spine 运行时库加载完成后，初始化 Spine 小部件
        const canvas = document.getElementById("spine-canvas");
        canvas.width = 300;
        canvas.height = 300;

        // 初始化 Spine 动画逻辑
        const spineLogicScript = document.createElement("script");
        spineLogicScript.src = "https://rimrose.top/spine-widget/spine-player.js";
        document.body.appendChild(spineLogicScript);
      };
      document.body.appendChild(spineScript);
    }
  </script>
  `,
    'default' // 注入到所有页面
);

// 动态加载外置的 CSS 文件（仅在非移动设备时加载）
hexo.extend.injector.register(
    'head_end', // 注入到页面 head 的末尾
    `
  <script>
    // 检测是否为移动设备
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 如果不是移动设备，则加载 CSS 文件
    if (!isMobileDevice()) {
      const spineCSS = document.createElement("link");
      spineCSS.rel = "stylesheet";
      spineCSS.href = "https://rimrose.top/spine-widget/spine-widget.css";
      document.head.appendChild(spineCSS);
    }
  </script>
  `,
    'default' // 注入到所有页面
);
```

里边提到的 `spine-widget.css`：
```css spine-widget.css
/* Spine 小部件容器 */
#spine-widget {
    position: fixed;
    bottom: 12px;
    right: 0;
    width: 250px;
    height: 250px;
    background-color: rgba(0,0,0,0);
    overflow: hidden;
    cursor: pointer;
    z-index: 999;
}

/* 画布 */
#spine-canvas {
    width: 100%;
    height: 100%;
}
```

## 4. 使用方法

在 Hexo 根目录的 `scripts` 目录下创建一个名为 `spine-widget.js` 的文件，并粘贴上述的注入器代码。

在 `source` 文件夹合适的地方创建一个 `spine-widget` 文件夹，在里边放上第二步提到的 `spine-player.js` 和 `spine-webgl.js` 文件以及第三步提到的 `spline-widget.css` 文件，可以同时在这个文件夹下创建一个 assets 文件夹，用来放你需要的模型

跟着做到这里就可以了，不过有一点需要注意的是，文件之间的路径会出现一点问题，建议在 `hexo deploy` 之后将上边出现的路径全部改为链接，比如我的博客里的 `spine-widget` 文件夹路径是：`https://rimrose.top/spine-widget/`，这样可以避免路径问题

## 参考：

- [在你的博客里放一只可爱的Spine Model吧](https://c10udlnk.top/p/blogsFor-hexo-puttingLivelySpineModels/)

- [Blog 添加 2d 模型 | Weakyon Blog](https://weakyon.com/2022/08/05/blog-add-2d-model.html)

- [从解包开始，让手游里的live2d角色成为你的看板娘吧！ - Kara's utopia (kara07.github.io)](https://kara07.github.io/2018/12/08/live2d/)

- [关于Spine Web Player 的使用 - ModePi](https://modepi.com/archives/38/)

- [【ArkPets】如何把全岛的干员变成桌宠？](https://www.bilibili.com/video/BV1bG4y1W7Lu)

- [给 Astro 添加 Spine 伪春菜](https://blog.anontokyo.com/blog/add-sc-spine-widget-on-astro/)

- [给你的网页加入Spine动画](https://www.wx-smile.com/428)

- [【明日方舟/博客园】博客上展示明日方舟小人](https://www.bilibili.com/video/BV1St4y1C7qr)

- [关于Spine Web Player 的使用](https://modepi.com/archives/38/)

## 写在后面

Spine 官方是有关于如何使用 Spine Web Player 的教程的：[Spine Web Player](https://zh.esotericsoftware.com/spine-player)

但是呢：

![](https://img.rimrose.work/20250315225528630.png)

![](https://img.rimrose.work/20250315230221863.png)

![](https://img.rimrose.work/20250315230236897.png)

好笑吗，我只看到了一个绝望的不会前端的 CV 工程师（逃）

上次鼓捣这个的时间居然是2024-06-11，令人感叹