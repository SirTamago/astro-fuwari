---
title: 'Multipass安装与使用中遇到的问题的一些记录'
published: 2024-11-25
description: ''
image: '' # ./cover.jpg
tags: [record]
category: TEC
draft: false
---

:::tip
原文地址：https://rimrose.top/Problems_of_Multipass/
:::

## 按时间顺序记录

首先是Multipass的安装（在这之前我应该已经安装又卸载过十几次），参考的教程为：[轻量虚拟机 Multipass 的部署和使用](https://www.cnblogs.com/hewei-blogs/articles/17569105.html)

**一、部署**

在windows环境下进行部署，下载最新安装包后别着急执行，先进行multipass数据目录的配置：

以管理身份运行powershell：输入以下命令：

```PowerShell
Set-ItemProperty -Path "HKLM:System\CurrentControlSet\Control\Session Manager\Environment" -Name MULTIPASS_STORAGE -Value "E:\MultipassData"
```

运行下载的可执行文件，选择自定义目录安装。

安装完成后查看版本：

打开任意 Windows 命令行，键入命令查看版本

```PowerShell
multipass --version
```

**二、创建运行 ubuntu 实例**

1. 设置客户端口令，然后通过 命令查看支持的镜像列表：

设置口令：设置multipass的口令为 multipass（原文有这个，但是其实我不知道有什么用，感觉多此一举）

```PowerShell
multipass set local.passphrase=multipass
```

通过命令查看支持的镜像列表（这个无所谓）

```PowerShell
multipass find
```

![](https://pic.imgdb.cn/item/65c10eef9f345e8d038b4b0b.png)

2. 通过命令创建实例（这里我的实例名用的是`rimrose`）：

```PoeweShell
multipass launch -n rimrose -c 4 -m 8G -d 64G
```

- -n, –name: 名称
- -c, –cpus: cpu 核心数, 默认: 1
- -m, –mem: 内存大小, 默认: 1G
- -d, –disk: 硬盘大小, 默认: 5G

不知道为什么，出现问题了（明明之前装了几次都没出现这样的问题）：

![](https://pic.imgdb.cn/item/65c10ef19f345e8d038b541c.png)

我怀疑是Hyper-V的问题，查看一下`设置 -> 系统 -> 可选功能 -> 更多Windows功能 -> Hyper-V`

![](https://pic.imgdb.cn/item/65c1116d9f345e8d0394e4e5.jpg)

但是这里Hyper-V是打开了的

那先跳过这里，尝试一下再次安装

还是出现了问题：

![](https://pic.imgdb.cn/item/65c111f29f345e8d0396c44a.jpg)

我选择把软件卸载重装

使用GeekUninstaller卸载掉Multipass（这个软件会扫描文件和注册表的残留）

然后右键管理员运行`multipass-1.13.0+win-win64.exe`，进行一个安装。这次安装过程中没有报错（上一次装的时候中间弹出一条我没看明白的Error）

那么按照上边的步骤再次进行部署——然后又报错了，不过这个报错和上边这个很像

![](https://pic.imgdb.cn/item/65c1186c9f345e8d03ae0fda.jpg)

这个时候我才注意到这个8192MB什么什么RAM，很明显是内存不够，这里放一下我电脑的内存使用情况

![](https://pic.imgdb.cn/item/65c119119f345e8d03b00aa9.jpg)

![](https://pic.imgdb.cn/item/65c119329f345e8d03b063f8.jpg)

（尴尬的笑）

然后我把内存改成4G就装上去了

![](https://pic.imgdb.cn/item/65c1196b9f345e8d03b108bf.jpg)

3. 通过命令查看运行的实例：

```PowerShell
multipass list
```

![](https://pic.imgdb.cn/item/65c119b89f345e8d03b1ec86.jpg)

在`开始 -> 所有应用`中找到multipass点击启动，然后就可以在任务栏看到图标

![](https://pic.imgdb.cn/item/65c11b529f345e8d03b69e36.jpg)

看到这个界面，点击`Open Shell`即可打开Ubuntu的终端。

**到这里为止，Multipass的安装就完成了**

时候不早了，先关机，第二天有空再继续（这点其实很重要，因为涉及到重启系统，指不定第二天开机会遇到什么奇葩问题）

—————————————分界线—————————————

现在是2024.2.6，刚刚开机又出现下边的问题（说“又”是因为之前的十几次安装中我已经遇到过这个问题）

![](https://pic.imgdb.cn/item/65bf85ad871b83018adfabb9.png)

然后我右键看到这个界面之后不久，应用图标消失了（？）

在PowerShell里输入`multipass list`，显示如下：

![](https://pic.imgdb.cn/item/65c1cacf9f345e8d030cb772.png)

再次点击应用图标启动软件，依然会出现`Failure retrieving instances`的问题

现在是2024.2.12，不知道为什么，我的虚拟机突然能运行了；在这之前，也就是6号第一次重新开机到现在为止的时间段里边，每次开机都是`Failure retrieving instances`

![](https://pic.imgdb.cn/item/65c9bb649f345e8d03a5c5ae.jpg)

所以趁着它能跑起来，我先把需要的东西给弄了，比如ros2（主要是想试着搞一下这篇博文里的东西 https://blog.csdn.net/weixin_44827364/article/details/104156116?spm=1001.2014.3001.5506 ）

![](https://pic.imgdb.cn/item/65ca0c139f345e8d039ae7b7.jpg)

成功了

不过用ros2需要GUI，所以下边装一下（参考 https://www.cnblogs.com/taylorshi/p/16039901.html ）

先更新一下包索引：
```bash
sudo apt-get update
```

![](https://pic.imgdb.cn/item/65cb10e09f345e8d03467061.jpg)

接下来开启安装

```bash
sudo apt-get install ubuntu-desktop xrdp -y
```

这将一次性安装`ubuntu-desktop`和`xrdp`两个软件

![](https://pic.imgdb.cn/item/65cb114a9f345e8d0347adc6.jpg)

稍等片刻之后，安装完成

![](https://pic.imgdb.cn/item/65cb11759f345e8d03484040.jpg)

接下来创建一个登录用户名用来登录桌面

```bash
sudo adduser $userName
```

![最后这个Full Name什么的应该不是必要的](https://pic.imgdb.cn/item/65cb12139f345e8d034a1bf3.jpg)

并且给这个用户赋予访问权限

```bash
sudo usermod -aG sudo $userName
```

![](https://pic.imgdb.cn/item/65cb20919f345e8d0375c532.jpg)

然后获取当前Ubuntu实例IP，在PowerShell中输入

```PowerShell
multipass list
```

![](https://pic.imgdb.cn/item/65cb28509f345e8d038dac18.jpg)

可以看到这里的ip是`172.19.113.37`（在Ubuntu的命令行里输入`ip a`也可以看到）

通过RDP客户端远程Ubuntu

用windows自带的搜索来搜索`远程`，找到`远程桌面连接`

![](https://pic.imgdb.cn/item/65cb28f89f345e8d038fa838.jpg)

打开它，输入刚才的IP地址，点击`连接`，在弹出的对话框选择`是`，这时我们可以看到一个登录对话框

![](https://pic.imgdb.cn/item/65cb295f9f345e8d0390dde3.jpg)

输入之前设定的用来登录桌面的用户名和密码，然后点击`OK`

![](https://pic.imgdb.cn/item/65cb298f9f345e8d03916bae.jpg)

这样我们就看到了Ubuntu的桌面引导，说明我们已经来到桌面了

![](https://pic.imgdb.cn/item/65cb29c59f345e8d03920d22.jpg)

等待软件更新

![](https://pic.imgdb.cn/item/65cb2a189f345e8d0392fec7.jpg)

这就是真正的Ubuntu桌面了，这太酷了

![](https://pic.imgdb.cn/item/65cb2f5c9f345e8d03a294e2.jpg)

不过这时候有个问题，在这个用户下使用不了ros2命令，也许是因为ros2安装位置不在这个用户的目录下，而且不互通

所以在这个用户下再次安装一遍ros2

![安装成功](https://pic.imgdb.cn/item/65cb317b9f345e8d03a972b4.jpg)

![](https://pic.imgdb.cn/item/65cb32169f345e8d03ab32e6.jpg)

到这里先告一段落，因为博主出去玩了，而且电脑已经三天没关了，我打算尝试一下先关闭multipass再关机，看下次开机会不会再出错

右键点击任务栏中的multipass图标，选中正在运行的虚拟机，点击`Stop`

![](https://pic.imgdb.cn/item/65cba0aa9f345e8d034d33fc.jpg)

等待主机名称后边的`Running`消失后再点击`Quit`

![](https://pic.imgdb.cn/item/65cba0f99f345e8d034e3c58.jpg)

然后关机

现在是2024.2.14，很不幸，再次出现了`Failure retrieving instances`的错误

![](https://pic.imgdb.cn/item/65cc4f429f345e8d03b10450.jpg)

现在我做一个大胆的猜想，会不会是multipass开机自启造成了这样的问题？所以试着把它的自启动关掉

![](https://pic.imgdb.cn/item/65cc53729f345e8d03bcbcbd.jpg)

下次开机再说吧

现在是2024.2.15，开机之后我点应用图标启动multipass，但还是出现了`Failure retrieving instances`的错误

现在是2024.2.20，刚刚我突然想用wallpaper engine，但是打开的时候有一个这样的提示：

![](https://pic.imgdb.cn/item/65d4c9279f345e8d0353ecd7.jpg)

提示说的没问题，我切到某几张视频壁纸的时候就无法播放了，很难受；这时候我觉得我之前搞得什么虚拟机啥的（还有别的软件或者系统本身）在使用过程中遇到各种奇怪的bug，也许和Windows的insider版本有关系，所以我决定从insider版本切换回稳定版

![我电脑现在的Windows版本](https://pic.imgdb.cn/item/65d4c7da9f345e8d034ee60c.jpg)

![这个倒是有半个月没有更新了](https://pic.imgdb.cn/item/65d4c9f29f345e8d0356f199.jpg)

![](https://pic.imgdb.cn/item/65d4cc3d9f345e8d035f3f99.jpg)

快进了一下，现在是2024.2.21的下午，我凌晨一点把系统重装回了win11稳定版，现在的系统信息如下

![](https://pic.imgdb.cn/item/65d5c8039f345e8d038de3cf.jpg)

![](https://pic.imgdb.cn/item/65d5c8259f345e8d038e3ba7.jpg)

本来想着说下午直接装个Ubuntu实体机的，但是感觉有点麻烦，先搞一下multipass试试

（此处省略一大堆步骤）

这里我又觉得multipass不如实体机来的方便，所以决定先搞实体机

![一定是Windows Update干的！](https://pic.imgdb.cn/item/65d5c99e9f345e8d0392a70a.jpg)

现在是2024.2.21，晚上的23：21，我把ubuntu实体机装好了，不需要虚拟机了（墨镜）

***To be continued -->***




## 遇到的问题

### 01

系统重启后遇到下边的情况：`Failure retrieving instances`

![](https://pic.imgdb.cn/item/65bf85ad871b83018adfabb9.png)

Google了一下解决方案，在 https://github.com/canonical/multipass/issues/2223 这里找到了答案。

在终端里输入

```PowerShell
Get-CimInstance Win32_ComputerSystem | Select-Object -ExpandProperty HypervisorPresent
```


出现`True`，然后再输入

```PowerShell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

等待进度条走满，输入`yes`确认重启，之后就打开了

![](https://pic.imgdb.cn/item/65bf85b0871b83018adfbc34.png)

但是又遇到问题了，这个虚拟机点击了start之后会变成unknown state。这时点击Quit，并且在任务管理器找到multipassd.exe，结束任务，再以管理员身份打开cmd，输入`multipassd`，这时在PowerShell里输入`multipass list`，可以看到有虚拟机，但是状态依然是unknown。这时关闭cmd，进程multipass.exe也随之关闭，在PowerShell里输入`multipass list`也看不到东西，会输出`list failed: cannot connect to the multipass socket`。这时点击multipass的应用图标打开软件，会发现再次出现错误Failure retrieving instances。