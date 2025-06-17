---
title: '平方数列求和的一种非正常求法'
published: 2022-03-21
description: '高中时候没学平方数列求和公式时候搞出来的一种比较麻烦的求法'
image: ''
tags: [math]
category: TEC
draft: false
---

:::tip
原文地址：https://rimrose.top/Sum_of_squares_sequence/
:::

在高中数学的学习过程中，我们应该会知道这样一个公式：

$$
\sum^n_{k=1}\left(2k-1\right)=n^2
$$

那么我们就会想到
$$
\sum^n_{k=1}k^2=\sum^n_{k=1}\left(\sum^n_{k=1}\left(2k-1\right)\right)
$$
展开来写，便是：
$$
\begin{split}
\sum_{k=1}^n k^2 &= 1+(1+3)+(1+3+5)+\dots+[1+3+5+\dots+(2n-1)]\\
&= 1\cdot n+3\cdot (n-1)+5\cdot (n-2)+\dots +(2n-1)\cdot [n-(n-1)]\\
&= n+(3n-3)+(5n-10)+\dots +[(2n-1)n-(2n-1)(n-1)]\\
&= (\textstyle\sum_{k=1}^n(2k-1))\cdot n-\textstyle\sum_{k=1}^n[(2k-1)(k-1)]\\
&= n^2\cdot n-\textstyle\sum_{k=1}^n(2k^2-3k+1)\\
&= n^3-2\textstyle\sum_{k=1}^nk^2+3\textstyle\sum_{k=1}^nk-\textstyle\sum_{k=1}^n\\
&=n^3-2\textstyle\sum_{k=1}^nk^2+3\cdot\frac{n(1+n)}{2}-n
\end{split}
$$
那么，我们就可以把 $\sum^n_{k=1}k^2$ 放在等号的一侧，即
$$3\sum\limits_{k=1}^{n}{k^2}=n^3+\frac{3n(1+n)}{2}-n$$
于是，
$$\sum\limits_{k=1}^{n}{k^2}=\frac{n^3+\frac{3n(1+n)}{2}-n}{3}=\frac{2n^3+3n^2+n}{6}=\frac{n(n+1)(2n+1)}{6}$$