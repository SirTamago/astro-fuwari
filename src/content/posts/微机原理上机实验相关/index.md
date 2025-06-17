---
title: '微机原理上机实验相关'
published: 2024-03-25
description: '本文基于教材《微机原理与接口技术(钱晓捷版)》，请按需查看'
image: ''
tags: [study]
category: TEC
draft: false
---

:::tip
原文地址：https://rimrose.top/%E5%BE%AE%E6%9C%BA%E5%8E%9F%E7%90%86%E4%B8%8A%E6%9C%BA%E5%AE%9E%E9%AA%8C%E7%9B%B8%E5%85%B3/
:::

本文内容基于微机原理老师发的 [2024年微机原理上机实验要求](https://xzqi2q6kpm.feishu.cn/docx/DPpBdb4EQolKIXxe79CcdYJ3n2g?from=from_copylink)

**重要的资源：**

[微机原理与接口技术(钱晓捷版)课后习题答案](https://max.book118.com/html/2017/0121/85726341.shtm)

## 实验任务1：熟悉DOS环境、熟悉汇编语言的开发过程和数据表达、变量定义及属性

### 1. 熟悉进入和退出32位控制台和16位DOS环境的方法。

### 2. 熟悉汇编语言的开发过程，实现教材例题2-1程序。

```asm eg0201.asm
		include io32.inc
		.data
msg    	byte 'Hello,Assembly!',13,10,0
		.code
start:
		mov eax,offset msg
		call dispmsg
		
		exit 0
		end start
```

![eg0201](https://pic.imgdb.cn/item/660514ad9f345e8d032a977c.png)

### 3. 掌握数据寻址方式，上机实现教材中的例题2-2程序。

```asm eg0202.asm
include io32.inc
.data
count dword 12345678h,9abcdef0h,0,0,3721h
.code
start:
mov eax,33221100h
mov ebx,eax
mov ecx,count
mov ebx,offset count
mov edx,[ebx]
mov esi,[ebx+4]
mov esi,4
mov edi,count[esi]
mov edi,[ebx+esi]
mov ecx,[ebx+esi*4]
mov edx,[ebx+esi*4-4]
mov ebp,esp
call disprd
exit 0
end start
```

![eg0202](https://pic.imgdb.cn/item/660514e29f345e8d032b977d.png)

### 4. 验证教材例题3-3，实现习题3.14程序。

```asm eg0303.asm
	include io32.inc
	.data
minint	= 10
wvar1	word 0,32768,65535,-32768,0,+32767
wvar2	word 1,-1,38,-38,38h,-38h
wvar3	word ?
wvar4	word 2010h,1020h
	word 5 dup(minint,?)
wvar6	word 3139h,3832h
bvar6	byte 39h,31h,32h,38h
	byte 0
	.code
start:
	mov eax,offset wvar6
	call dispmsg
	exit 0
	end start
```

![eg0303](https://pic.imgdb.cn/item/660514359f345e8d03285a27.png)

```asm ex0314.asm
		include io32.inc
		.data;代码段
table	byte ' | 0 1 2 3 4 5 6 7 8 9 A B C D E F',13,10
		byte '---+-------------------------------',13,10
		byte '20 |',20h,20h,21h,20h,22h,20h,23h,20h,24h,20h,25h,20h,26h,20h,27h,20h,28h,20h,29h,20h
		byte 2ah,20h,2bh,20h,2ch,20h,2dh,20h,2eh,20h,2fh,20h,13,10
		byte '30 |',30h,20h,31h,20h,32h,20h,33h,20h,34h,20h,35h,20h,36h,20h,37h,20h,38h,20h,39h,20h
		byte 3ah,20h,3bh,20h,3ch,20h,3dh,20h,3eh,20h,3fh,20h,13,10
		byte '40 |',40h,20h,41h,20h,42h,20h,43h,20h,44h,20h,45h,20h,46h,20h,47h,20h,48h,20h,49h,20h
		byte 4ah,20h,4bh,20h,4ch,20h,4dh,20h,4eh,20h,4fh,20h,13,10
		byte '50 |',50h,20h,51h,20h,52h,20h,53h,20h,54h,20h,55h,20h,56h,20h,57h,20h,58h,20h,59h,20h
		byte 5ah,20h,5bh,20h,5ch,20h,5dh,20h,5eh,20h,5fh,20h,13,10
		byte '60 |',60h,20h,61h,20h,62h,20h,63h,20h,64h,20h,65h,20h,66h,20h,67h,20h,68h,20h,69h,20h
		byte 6ah,20h,6bh,20h,6ch,20h,6dh,20h,6eh,20h,6fh,20h,13,10
		byte '70 |',70h,20h,71h,20h,72h,20h,73h,20h,74h,20h,75h,20h,76h,20h,77h,20h,78h,20h,79h,20h
		byte 7ah,20h,7bh,20h,7ch,20h,7dh,20h,7eh,20h,7fh,20h,13,10
		byte 0
		.code
start:
	    mov eax,offset table
	    call dispmsg
	    exit  0
	    end start
```

![ex0314](https://pic.imgdb.cn/item/6605147f9f345e8d0329c232.png)

```asm eg0423.asm
.686
	.model flat,stdcall
	option casemap:none
	includelib bin\kernel32.lib
	includelib bin\user32.lib
ExitProcess proto,:DWORD
MessageBoxA PROTO :DWORD,:DWORD,:DWORD,:DWORD
MessageBox  equ <MessageBoxA>
NULL	equ 0
MB_OK    equ 0
	.data
szCaption    byte '消息窗口',0
outbuffer    byte '本机的处理器是', 12 dup(0),0
outbufsize  = sizeof outbuffer-1
	.code
start:  mov eax,0
	cpuid    ; 获得显示器信息
	mov dword ptr outbuffer+outbufsize-12,ebx
	mov dword ptr outbuffer+outbufsize-8,edx
	mov dword ptr outbuffer+outbufsize-4,ecx
	invoke MessageBox,\
	  NULL,addr outbuffer,addr szCaption,MB_OK
	invoke ExitProcess,NULL
	end start
```

![eg0423](https://pic.imgdb.cn/item/6605150b9f345e8d032c5bc1.png)

## 实验任务2：熟悉汇编语言中的常用传送和运算指令的应用

```asm ex0320.asm
	include io32.inc	
	.code
start:
	mov eax,80h
	call disprf
	call disphd
	call dispcrlf
	add eax,3
	call disprf
	call disphd
	call dispcrlf
	add eax,80h
	call disprf
	call disphd
	call dispcrlf
	add eax,3
	call disprf
	call disphd
	call dispcrlf
	call dispcrlf

	mov eax,100
	call disprf
	call disphd
	call dispcrlf
	add ax,200
	call disprf
	call disphd
	call dispcrlf
	call dispcrlf

	mov eax,100
	call disprf
	call disphd
	call dispcrlf
	add al,200
	call disprf
	call disphd
	call dispcrlf
	call dispcrlf

	mov al,7fh
	call disprf
	call disphd
	call dispcrlf
	sub al,8
	call disprf
	call disphd
	call dispcrlf
	sub al,80h
	call disprf
	call disphd
	call dispcrlf
	sbb al,3
	call disprf
	call disphd
	call dispcrlf
		
	exit 0
	end start
```

## 实验任务3：掌握、理解位操作、串操作类指令

```asm ex0328.asm
	include io32.inc
	.data
bcd	byte 92h
	.code
start:
	mov al,bcd
	shr al,4
	add al,30h
	call dispc

	mov al,bcd
	and al,0fh
	add al,30h
	call dispc
exit 0
end start
```
## 实验任务4：掌握转移指令和分支程序结构

```asm ex0405.asm
	include io32.inc
	.data
no_msg	byte 'Not Ready!',0
yes_msg	byte 'Ready to Go!',0
	.code
start:
	;mov eax,58h	; 假设一个数据
	mov eax,56h
	;test eax,02h	; 测试D1位（使用D1＝1，其他位为0的数据）
	shr eax,2
	;jnz yesm	; D1＝1条件成立，转移
	jnc yesm
	mov eax,offset no_msg	; D1＝0，显示没有准备好
	jmp done	; 跳转过另一个分支体！
yesm:	mov eax,offset yes_msg	; 显示准备好
done:	call dispmsg

	exit 0
	end start
```
![ex0405](https://pic.imgdb.cn/item/662792ec0ea9cb1403f32102.png)

```asm ex0411.asm
		include io32.inc
		.data
inmsg	byte 'Input number(0~9):',0
ermsg	byte 0dh,0ah,'ERROR! Input again:',0
		.code
start:
		mov eax,offset inmsg
		call dispmsg
again:	call readc
		cmp al,'0'
		jb erdisp
		cmp al,'9'
		ja erdisp
		call dispcrlf
		call dispc
		jmp done
erdisp:	mov eax,offset ermsg
		call dispmsg
		jmp again
done:	
		exit 0
		end start
```

![ex0411](https://pic.imgdb.cn/item/662793890ea9cb1403f42e4e.png)

## 实验任务5：掌握循环指令和循环程序结构
### ① 掌握循环指令和循环程序结构。验证例题4-12程序，实现习题4.13程序。

```asm eg0412.asm
	include io32.inc
	.data
string	byte 'Do you have fun with Assembly?',0	; 以0结尾的字符串
	.code
start:
	xor ebx,ebx	 ;EBX用于记录字符个数，同时也用于指向字符的指针
again:	
	mov al,string[ebx]
	cmp al,0
	jz done
	inc ebx  ;个数加1
	jmp again	;继续循环
done:	
	mov eax,ebx	 ;显示个数
	call dispuid
	
	exit 0
	end start
```
![eg0412](https://pic.imgdb.cn/item/6639fa1b0ea9cb14038259ea.png)

```asm ex0413.asm
	include io32.inc
	.data
	string byte 'Do you have fun with Assembly ?',0  ;以О结尾的字符串
	space dword ?
	.code
start:
	mov esi,offset string
	xor ebx, ebx;  EBX用于记录空格数
again:
	mov al,[esi]
	cmp al,0
	jz donecmp al, 20h  ;空格的ASCII 码是20H
	jne next  ;不相等、不是空格，转移
	inc bx  ;相等、是空格，空格个数加1
next:
	inc esi
	jmp again  ;继续循环
done:
	mov space, ebx  ;保存结果
	mov eax,space
	call dispuid
	exit 0
	end start
```
![ex0413](https://pic.imgdb.cn/item/663a01620ea9cb14038e087c.png)
### ② 验证例题4-10程序。实现如下程序：进行自然数相加（1＋2＋3＋……＋N）；如果（无符号整数的）累加和用一个32位寄存器存储，求出有效累加和的最大值及N的界限。

```asm eg0410.asm
include io32.inc
.data
.code
start:
    mov edx, 1
    mov esi, 2

done1:
    add edx, esi ; 自然数相加，求和
    jc done ; 最高位进位，跳转
    inc esi ; 加数加一
    jmp done1 ; 重复进行自然数相加

done:
    sub esi, 1 ; 加数减一，使累加和不进位而有效
    mov ebx, 1
    mov ecx, 2

nom:
    add ebx, ecx ; 求得有效累加和
    cmp ecx, esi ; 使加数到N的界限停止
    jz again
    inc ecx ; 加数加一
    jmp nom ; 重复进行自然数相加

again:
    mov eax, ebx ; 显示有效累加和的最大值
    call dispuid
    call dispcrlf ; 换行

    mov eax, ecx ; 显示N的界限
    call dispuid

exit 0
end start
```

>**来源：**
> **Q:**
> 现在你的环境为64位windows11系统，但是可以使用32位cmd运行make32指令。请基于使用io32.inc的32位汇编语言写一段代码，实现如下程序：进行自然数相加（1＋2＋3＋……＋N）；如果（无符号整数的）累加和用一个32位寄存器存储，求出有效累加和的最大值及N的界限，并且输出这两个变量。特别注意，请将可以输出结果的完整程序代码写出。
> **A:**
>当然，我可以帮你写一段32位汇编语言的代码来实现这个功能。首先，让我们来分析一下问题。
>
> 你需要计算自然数相加的累加和（1 + 2 + 3 + … + N），并且将结果存储在一个32位寄存器中。然后，你要找到有效累加和的最大值以及N的界限。
>
>以下是一个满足你需求的汇编代码示例，使用了 `io32.inc` 文件：
```asm
include io32.inc
.data
.code
start:
    mov edx, 1
    mov esi, 2

done1:
    add edx, esi ; 自然数相加，求和
    jc done ; 最高位进位，跳转
    inc esi ; 加数加一
    jmp done1 ; 重复进行自然数相加

done:
    sub esi, 1 ; 加数减一，使累加和不进位而有效
    mov ebx, 1
    mov ecx, 2

nom:
    add ebx, ecx ; 求得有效累加和
    cmp ecx, esi ; 使加数到N的界限停止
    jz again
    inc ecx ; 加数加一
    jmp nom ; 重复进行自然数相加

again:
    mov eax, ebx ; 显示有效累加和的最大值
    call dispuid
    call dispcrlf ; 换行

    mov eax, ecx ; 显示N的界限
    call dispuid

exit 0
end start
```
>这段代码首先使用 `edx` 和 `esi` 寄存器进行自然数相加，直到累加和不再进位。然后，它计算有效累加和的最大值并找到N的界限。
>
> [请注意，这只是一个示例代码，你可以根据你的需求进行修改。如果你有其他问题或需要进一步的解释，请随时告知！](https://zhuanlan.zhihu.com/p/367924850)[[1]](https://zhuanlan.zhihu.com/p/367924850)[[2]](https://blog.csdn.net/m0_46339652/article/details/116395716)[[3]](https://blog.csdn.net/u011555996/article/details/80265537)
>
>希望这对你有所帮助！