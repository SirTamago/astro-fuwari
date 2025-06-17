---
title: 电子设计自动化实验报告
published: 2024-11-25
description: '实验基于FPGA黑金开发平台AX301，此款开发板使用的是 ALTERA 公司的 Cyclone IV 系列 FPGA，型号为 EP4CE6F17C8'
image: ''
tags: [study]
category: TEC
draft: false
---

:::tip
原文地址：https://rimrose.top/%E7%94%B5%E5%AD%90%E8%AE%BE%E8%AE%A1%E8%87%AA%E5%8A%A8%E5%8C%96%E5%AE%9E%E9%AA%8C%E6%8A%A5%E5%91%8A/
:::

[电子设计自动化-实验报告](https://xzqi2q6kpm.feishu.cn/docx/YJQ9dlY4NooN5zxSEK3c6LNlneb?from=from_copylink)

<center><h1>实验一：LED流水灯设计</h1></center>

## 一、实验目的

1. 熟悉QuartusII开发环境

2. 掌握FPGA开发流程

## 二、实验内容及原理

### 1. 实验内容

通过设计计数器，实现LED流水灯的效果

### 2. 实验原理

- LED硬件电路

<center><img src="https://img.rimrose.work/EDA_expt-1_led_test (2).png" alt="Fig.2.1 AX301 开发板LED 部分原理图"></center>


从上面的 LED 部分原理图可以看出，LED 电路有两个方式，AX301 开发板将 IO 经过一个电阻和 LED 串联接地，IO 输出高电平点亮 LED。其中的串联电阻是为了限制电流。

- 程序设计

FPGA 的设计中通常使用计数器来计时，对于 50Mhz 的系统时钟，一个时钟周期是 20ns，那 么表示一秒需要 50000000 个时钟周期，如果一个时钟周期计数器累加一次，那么计数器从 0 到 49999999 正好是 50000000 个周期，就是 1 秒的时钟。 程序中定义了一个 32 位的计数器：

```Verilog
//Define the time counter 
reg [31:0] timer;
```

最大可以表示 4294967295，十六进制就是 FFFFFFFF，如果计数器到最大值，可以表示 85.89934592 秒。程序设计中是每隔 1 秒 LED 变化一次，一共消耗 4 秒做一个循环。

```Verilog
always@(posedge clk or negedge rst_n)
begin
if (rst_n == 1'b0) 
timer <= 32'd0; 
else if (timer == 32'd199_999_999) 
timer <= 32'd0; 
else
timer <= timer + 32'd1; 
end
```

在第一秒、第二秒、第三秒、第四秒到来的时候分别改变 LED 的状态，其他时候都保持原来 的值不变。

```Verilog
// LED control
always@(posedge clk or negedge rst_n)
begin
if (rst_n == 1'b0)
led <= 4'b0000; 
else if (timer == 32'd49_999_999) 
led <= 4'b0001;
else if (timer == 32'd99_999_999) 
led <= 4'b0010;
else if (timer == 32'd149_999_999) 
led <= 4'b0100;
else if (timer == 32'd199_999_999) 
led <= 4'b1000;
end
```

## 三、实验步骤及结果

### 1. 建立工程

（1） 启动 Quartus (Quartus Prime 17.1) Lite Edition 开发环境，选择菜单 File->New Project Wizerd

（2） 选择“Next>”

（3） 添加工程路径，工程名称，顶层设计实体名称，顶层设计实体名称默认和工程名称一 致，可以修改为不一致。顶层设计实体名称在设计中必须存在而且和这里设置的一致， 本实验顶层设计指定为 led_test，设计中就要有 module led_test，大小写敏感。在 quartus 软件中也可以指定某一个模块为顶层模块。

（4） 工程类型选择空工程

（5） 添加文件，这个时候没有任何设计文件，直接 Next

（6） 芯片选择，AX301 开发板 器件选择 Cyclone IV E（EP4CE6F17C8）

（7） EDA 工具设置，这里默认即可

（8） 完成工程向导

（9） 返回 Quartus 工作界面

### 2. 编写代码

（1） 新建 Verilog HDL 文件

（2） 编写 Verilog 代码

（3） 代码写入完成后点击保存。这里默认将这个文件添加到工程中。

（4） 查看工程里的文件，在工程导航的下拉菜单里选择 Files 即可。

（5）文件的操作。选择某个文件，右键，可以看到一些操作选项，“Remove File from Project”，将文件移除工程，“Set as Top-Level Entity”设置为顶层实体，如果建立工 程时指定的顶层实体名称不对，可以在这里修改。本实验这里无需做任何修改和操作。

### 3. 其他设置

（1）设置未用管脚和默认电平标准，选择 Assignments -> Device 即可打开器件配置，如果 前面选择选择不正确，这里可以重新选择器件。

（2）点击“Device and Pin Options”在“Unused Pins”选项中"Reserve unused pins",设置为 "As input tri-stated"，这里是把没有使用的管脚做为三态输入。

（3）在“Voltage”选项，将“Default I/O standard:”设置为“3.3-V LVTTL”，这个设置是 和 FPGA 硬件设计的 bank 电压有关，黑金的大部分开发板的 IO BNAK 电压为 3.3V，所 以设置为“3.3-V LVTTL”。输出电压和设置没有关系，如果 BANK 电压是 3.3V，你这 里设置 2.5V，也不会改变 IO 输出的电压幅度。这里设置完成以后 IO 的默认电压为 “3.3-V LVTTL”，我们也可以根据需要为每个 IO 分配不一样的 IO 电平标准。

（4）多用途管脚设置。在选项“Dual-Purpose Pins”中设置多用途 IO，全部做为普通 IO。 这些多用途管脚，在 FPGA 配置阶段有特殊用途，配置完成后可以做为普通 IO。

（5）预编译。没有分配管脚，但是我们需要预编译一下（完成第一阶段综合过程），让 quartus 分析设计中的输入输出管脚。编译过程中信息显示窗口不断显示出各种信息， 如果出现红色，表示有错误，双击这条信息可以定位具体错误位置。

（6）IO 管脚分配。管脚分配的目的是为设计和实际的硬件电路关联起来，这里的连接关系 从硬件原理图得来。

（7） 在“Location”列填入 led、时钟、的管脚名称，需要注意是：一定要在“Location” 列填写。小技巧：这个表格可以像 EXCEL 表格一样复制粘贴，可以从其他工程的管脚 分配复制过来，然后粘贴，也可以在一个 EXCEL 表格里复制过来。管脚分配完成以后 关闭窗口就可以。需要注意的是：每个 IO 都必须分配管脚，如果有未分配的 IO，软 件可能会随机分配，造成不可预料的后果，严重时可烧坏 FPGA 芯片。

### 4. 编译下载

（1）再次编译。上次编译时还没有分配管脚，分配管脚后我们在任务流程窗口可以看到只 有第一下流程“综合”是“√”状态，其他都是“？”状态，“？”状态表示需要重 新编译才行。为了方便，这里双击“Compile Design”，完成全部编译流程。

（2）编译完成以后可以看到一个编译报告，主要报告各种资源的使用情况。在 output_files 文件夹我们可以看到一个 test_led.sof 文件，这个文件可以通过 JTAG 方式下载到 FPGA 运行，但不能直接固化到 Flash。

（3）将下载器连接 PC 和开发板，接通电源（注意要先插下载器的 JTAG 排线，然后再 上电）

（4）打开下载界面，这里通过工具栏快捷方式点击下载按钮。很多操作都可以在这里快速 点击进行。

（5）正常情况下弹出的窗口 Mode 已经选择 JTAG 模式，下载器已经识别到了，并且下载 文件都已经找好。需要注意的是：芯片型号跟开发板必须一致，否则会无法下载；下 载的 sof 文件一次只能添加一个。一切正常，点击“start”按钮，进度条开始滚动， 遇到错误时，Quartus 信息窗口会显示出具体的错误。

（6）如果没有识别到下载器，可以点击“Hardware Setup”，双击列表中的下载器即可。 如果列表中没有任何下载器，检查设备管理器里是不是有“Altera USB-Blaster”，如 果硬件设备管理器中有，Quartus 无法识别，通常是装了多个版本的 Quartus 造成的。

### 5. 固化程序到flash

在黑金 FPGA 开发板中使用 SPI Flash 固化 FPGA 程序。

#### 5.1. 转换jic文件

（1） Quartus 里选择菜单“File -> Convert Programming Files....”

（2） 选择“Programming file type”为“JTAG Indirect Configuration File(.jic)”。 “Configuration device”根据开发板型号选择，AX301 开发板、AX4010 开发板选择 EPCS16（指 16M Flash），AX515 开发板、AX530 开发板选择 EPCS64（指 64M Flash）。

（3） “Flash Loader”选中，点击“Add Device”

（4） 器件选择根据开发板型号选择，AX301 开发板选择“EP4CE6”

（5） 选择“SOF Data”栏，点击“Add File...”

（6） 选择要固化的 sof 文件, 这里我们选择前面生成的流水灯 led_test.sof 文件。

（7） 点击“Genrate”就可以生成 jic 文件

#### 5.2. 固化到flash

（1） 打开下载管理界面，删除其他已有的下载文件，添加上面生成的 jic 文件，注意，只保 留一个 jic 文件。在"Program/Configure"打钩“√”。点击“Start”按钮。

（2） 下载 Flash 后，断电重启开发板，程序就可以运行了

### 6. 擦除Flash中已有的程序

（1） 如果要擦除 Flash 中的程序，先添加一个 jic 文件（只有一个 jic 文件），选择“Erase” 列，点击“Start”，完成擦写。

<center><img src="https://img.rimrose.work/EDA_expt-1_led_test-flow_summary.png" alt="Fig.2.2 FlowSummary"></center>

<center><img src="https://img.rimrose.work/EDA_expt-1_led_test-RTL.png" alt="Fig.2.3 RTL电路图" title=""></center>

<center><img src="https://img.rimrose.work/EDA_expt-1_led_test-pin_planner.png" alt="Fig.2.4 PinPlanner" title=""></center>

## 四、实验中遇到的问题及解决方法

跟着实验步骤一次实现，所以暂无遇到问题。

## 五、源程序和testbench代码

> led_test.v

```Verilog
`timescale 1ns / 1ps
module led_test
(
input clk, // system clock 50Mhz on board
input rst_n, // reset ,low active
output reg[3:0] led // LED,use for control the LED signal on board
);
//define the time counter
reg [31:0] timer;
// cycle counter:from 0 to 4 sec
always@(posedge clk or negedge rst_n)
begin
if (rst_n == 1'b0)
timer <= 32'd0; //when the reset signal valid,time counter clearing
else if (timer == 32'd199_999_999) //4 seconds count(50M*4-1=199999999)
timer <= 32'd0; //count done,clearing the time counter
else
timer <= timer + 32'd1; //timer counter = timer counter + 1
end
// LED control
always@(posedge clk or negedge rst_n)
begin
if (rst_n == 1'b0)
led <= 4'b0000; //when the reset signal active
else if (timer == 32'd49_999_999) //time counter count to 1st sec,LED1 lighten
led <= 4'b0001;
else if (timer == 32'd99_999_999) //time counter count to 2nd sec,LED2 lighten
led <= 4'b0010;
else if (timer == 32'd149_999_999) //time counter count to 3rd sec,LED3 lighten
led <= 4'b0100;
else if (timer == 32'd199_999_999) //time counter count to 4th sec,LED4 lighten
led <= 4'b1000;
end
endmodule
```

## 六、心得体会

在学习FPGA开发过程中，我尝试了基于AX301开发板的LED流水灯设计实验。以下是我的心得体会：

AX301开发板概述：

AX301是一款基础的学生实验板，用于学习FPGA开发。它采用ALTERA公司的CYCLONE IV系列FPGA，型号为EP4CE6F17C8，具有256个引脚。AX301的资源包括逻辑单元、乘法器、RAM、IO口等。

流水灯实验：

我使用Quartus II软件编写了流水灯实验的Verilog代码。通过计数器对系统时钟进行计数，实现LED灯的循环点亮和熄灭。通过移位寄存器控制IO口的高低电平，改变LED的显示状态。

开发板下载流程：

编译Verilog代码并进行引脚分配。使用USB-Blaster下载文件到开发板。注意将sof文件转化为jic文件，以避免掉电丢失数据。

AX301开发板是学习FPGA的良好选择，流水灯实验帮助我更好地理解了FPGA开发和调试过程。

（心得体会的内容由newbing生成，望知悉）

---

<center><h1>实验二：数码管动态显示</h1></center>

## 一、实验目的

1. 熟悉数码管动态显示原理

2. 掌握组合电路和时序电路设计方法

## 二、实验内容及原理

### 1. 实验内容

两位数码管动态显示

### 2. 实验原理

#### 2.1. 硬件介绍

开发板上安装了 6 个共阳数码管，可以显示 6 个数字(包含小数点) 。电路用 PNP 管来反向驱 动并且控制列扫描信号（SEL0_T~SEL5_T）来选择哪个数码管。而且所有的 6 个数码管的“段选信 号”（LEDA .. LEDH）都共用驱动引脚(LED_A~LEDH)。数码管的所有驱动信号都是“低电平有效”。 具体的原理图设计如下图所示:

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.1.png" alt="Fig-2.1 AX301开发板数码管电路"></center>

#### 2.2. 数码管扫描原理

单个数码管可以采用静态显示方式，如图所示，数码管被分成 a、b、c、d、e、f、g 和小数 点，每段可以单独控制亮灭，通过点亮不同的段显示不同的数字和字符。

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.2.jpg" alt="Fig-2.2"></center>

对于共阳极的数码管，显示数字和字符的编码如下：

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.3.jpg" alt="Fig-2.3"></center>
<div></div>
<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.4.png" alt="Fig-2.4"></center>

对于多位数码管，利用视觉暂留原理，快速交替显示，让眼睛看上去是多个数码管同时显示的。

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.5.jpg" alt="Fig-2.5"></center>
<div></div>
<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.6.jpg" alt="Fig-2.6"></center>

## 三、实验步骤及结果

### 1. 程序设计

本实验设计一个 2 位六十进制计数器模块（由一个十进制计数器和一个六进制计数器实现），然后通过译码模块译码后送到数码管扫描模块扫描显示。

### 2. 模块设计

#### 2.1. 译码模块

主要作用是将二进制码转换成数码管的段控制信号。

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.7.png" alt="Fig-2.7 译码模块（seg_decoder）端口"></center>

#### 2.2. 数码管扫描模块

将多位数码管的段控制信号分时送出。

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.8.png" alt="Fig-2.8 数码管扫描模块（seg_scan）端口"></center>

#### 2.3. 模 10 计数器模块

模块有同步复位，计数使能，进位输出功能，计数值从 0-9，并在等于 9 时进位。

#### 2.4. 模 6 计数器模块

模块有同步复位，计数使能，进位输出功能，计数值从 0-5，并在等于 5 时进位。

### 3. 实验结果

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.9.png" alt="Fig-2.9 Flow Summary"></center>
<div></div>
<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.10.png" alt= "Fig-2.10 RTL电路图"></center>
<div></div>
<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.11.png" alt="Fig-2.11 pin-planner"></center>
<div></div>
<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.12.png" alt="Fig-2.12 仿真结果"></center>

> 附：源程序代码

```Verilog
//seg_test.v
module seg_test(
                input      clk,
                input      rst_n,
                output[5:0]seg_sel,
                output[7:0]seg_data
                );
      
reg[31:0] timer_cnt;
reg en_1hz;                          //1 second , 1 counter enable
always@(posedge clk or negedge rst_n)
begin
    if(rst_n == 1'b0)
    begin
        en_1hz <= 1'b0;
        timer_cnt <= 32'd0;
    end
    else if(timer_cnt >= 32'd49_999_999)
    begin
        en_1hz <= 1'b1;
        timer_cnt <= 32'd0;
    end
    else
    begin
        en_1hz <= 1'b0;
        timer_cnt <= timer_cnt + 32'd1; 
    end
end
wire[3:0] count0;
wire t0;
count_m10 count10_m0(
    .clk    (clk),
    .rst_n  (rst_n),
    .en     (en_1hz),
    .clr    (1'b0),
    .data   (count0),
    .t      (t0)
 );
wire[3:0] count1;
wire t1;
count_m6 count6_m1( //oringin: count_m10 count10_m1
     .clk    (clk),
     .rst_n  (rst_n),
     .en     (t0),
     .clr    (1'b0),
     .data   (count1),
     .t      (t1)
 );
 
wire[3:0] count2;
wire t2;
count_m10 count10_m2(
    .clk   (clk),
    .rst_n (rst_n),
    .en    (t1),
    .clr   (1'b0),
    .data  (count2),
    .t     (t2)
);
 
wire[3:0] count3;
wire t3;
count_m10 count10_m3(
    .clk   (clk),
    .rst_n (rst_n),
    .en    (t2),
    .clr   (1'b0),
    .data  (count3),
    .t     (t3)
);
 
wire[3:0] count4;
wire t4;
count_m10 count10_m4( 
    .clk   (clk),
    .rst_n (rst_n),
    .en    (t3),
    .clr   (1'b0),
    .data  (count4),
    .t     (t4)
);
 
wire[3:0] count5;
wire t5;
count_m10 count10_m5(
    .clk   (clk),
    .rst_n (rst_n),
    .en    (t4),
    .clr   (1'b0),
    .data  (count5),
    .t     (t5)
);
 
wire[6:0] seg_data_0;
seg_decoder seg_decoder_m0(
    .bin_data  (count5),
    .seg_data  (seg_data_0)
);
wire[6:0] seg_data_1;
seg_decoder seg_decoder_m1(
    .bin_data  (count4),
    .seg_data  (seg_data_1)
);
wire[6:0] seg_data_2;
seg_decoder seg_decoder_m2(
    .bin_data  (count3),
    .seg_data  (seg_data_2)
);
wire[6:0] seg_data_3;
seg_decoder seg_decoder_m3(
    .bin_data  (count2),
    .seg_data  (seg_data_3)
);
wire[6:0] seg_data_4;
seg_decoder seg_decoder_m4(
    .bin_data  (count1), //attention, this is COUNT1
    .seg_data  (seg_data_4)
);
 
wire[6:0] seg_data_5;
seg_decoder seg_decoder_m5(
    .bin_data  (count0),
    .seg_data  (seg_data_5)
);
 
seg_scan seg_scan_m0(
    .clk        (clk),
    .rst_n      (rst_n),
    .seg_sel    (seg_sel),
    .seg_data   (seg_data),
    .seg_data_4 ({1'b1,seg_data_4}),
    .seg_data_5 ({1'b1,seg_data_5})
);
endmodule 
```

```Verilog
//count_m10.v
module count_m10(
                 input          clk,
                 input          rst_n,
                 input          en,    //Counter enable
                 input          clr,   //Counter synchronous reset   
                 output reg[3:0]data,  //counter value
                 output reg     t      // carry enable signal
                );
always@(posedge clk or negedge rst_n) 
begin
    if(rst_n==0)
    begin
        data <= 4'd0;
        t <= 1'd0;
    end
    else if(clr)
    begin
        data <= 4'd0;
        t <= 1'd0;      
    end
    else if(en)
    begin
        if(data==4'd9)
        begin
            t<= 1'b1;    //Counter to 9 to generate carry
            data <= 4'd0;//Counter to 9 reset
        end
        else
        begin
            t <= 1'b0;
            data <= data + 4'd1;
        end
    end
    else
        t <= 1'b0;
end
 
endmodule
```

```Verilog
//count_m6.v
module count_m6(
                 input          clk,
                 input          rst_n,
                 input          en,    //Counter enable
                 input          clr,   //Counter synchronous reset   
                 output reg[3:0]data,  //counter value
                 output reg     t      // carry enable signal
                );
always@(posedge clk or negedge rst_n) 
begin
    if(rst_n==0)
    begin
        data <= 4'd0;
        t <= 1'd0;
    end
    else if(clr)
    begin
        data <= 4'd0;
        t <= 1'd0;      
    end
    else if(en)
    begin
        if(data==4'd5)
        begin
            t<= 1'b1;    //Counter to 5 to generate carry
            data <= 4'd0;//Counter to 5 reset
        end
        else
        begin
            t <= 1'b0;
            data <= data + 4'd1;
        end
    end
    else
        t <= 1'b0;
end
 
endmodule
```

```Verilog
//seg_decoder.v
module seg_decoder
(
 input[3:0]      bin_data,     // bin data input
 output reg[6:0] seg_data      // seven segments LED output  //origin: [6:0]
);
 
always@(*)
begin
 case(bin_data)
  4'd0:seg_data <= 7'b100_0000;
  4'd1:seg_data <= 7'b111_1001;
  4'd2:seg_data <= 7'b010_0100;
  4'd3:seg_data <= 7'b011_0000;
  4'd4:seg_data <= 7'b001_1001;
  4'd5:seg_data <= 7'b001_0010;
  4'd6:seg_data <= 7'b000_0010;
  4'd7:seg_data <= 7'b111_1000;
  4'd8:seg_data <= 7'b000_0000;
  4'd9:seg_data <= 7'b001_0000;
  4'ha:seg_data <= 7'b000_1000;
  4'hb:seg_data <= 7'b000_0011;
  4'hc:seg_data <= 7'b100_0110;
  4'hd:seg_data <= 7'b010_0001;
  4'he:seg_data <= 7'b000_0110;
  4'hf:seg_data <= 7'b000_1110;
  default:seg_data <= 7'b111_1111;
 endcase
end
endmodule
```

## 四、实验中遇到的问题及解决方法

### 问题

数码管显示不完整

### 解决方案

发现是因为修改代码的过程中把数码管段控制修改错误，应是seg_data_5和seg_data_6，错改成了1和2，改回来即可；以及修改过程中将管脚配置写错，改回默认即可。

## 五、心得体会

通过本次实验，我深入理解了数码管的工作原理和动态扫描显示的实现方法。

我学会了如何在 FPGA 上设计和连接不同模块，实现复杂的功能。

首先，我们设计了一个十进制计数器模块，用于计时秒数。当计数到 9 时，它会自动清零并触发六进制计数器开始新一轮计数。

其次，我们实现了一个六进制计数器模块，用于计数分钟。当六进制计数器达到 6 时，它会自动清零，并通知译码模块开始新一轮计数。

我们使用了七段显示译码器，将计数器的输出转换为七段数码管的控制信号。

最后，我们编写了数码管扫描模块，控制数码管的显示。

我们成功地实现了一个 2 位六十进制计数器，可以准确地显示秒数和分钟数。

数码管的扫描显示效果流畅，没有闪烁或乱码。

通过这次实验，我不仅掌握了硬件描述语言的基本知识，还提高了问题解决能力。

我对 FPGA 的应用有了更深入的了解，希望在今后的学习和工作中能继续探索更多有趣的项目。

这次实验让我更加熟悉了数字电路设计和 FPGA 编程，也为我未来的职业发展打下了坚实的基础。

（心得体会由newbing生成，望知悉）

---
<center><h1>实验三：数字时钟设计</h1></center>

## 一、实验目的

1. 掌握元件例化方法

2. 掌握自上而下的电路设计方法

## 二、实验内容及原理

### 1. 实验内容

设计一个数字时钟，通过6个数码管分别显示小时、分钟和秒。

<center><img src="https://img.rimrose.work/EDA_expt-3_Fig3.0.png"></center>

### 2. 实验原理

#### 2.1. 硬件介绍

开发板上安装了 6 个共阳数码管，可以显示 6 个数字(包含小数点) 。电路用 PNP 管来反向驱 动并且控制列扫描信号（SEL0_T~SEL5_T）来选择哪个数码管。而且所有的 6 个数码管的“段选信 号”（LEDA .. LEDH）都共用驱动引脚(LED_A~LEDH)。数码管的所有驱动信号都是“低电平有效”。 具体的原理图设计如下图所示:

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.1.png" alt="Fig-3.1 AX301开发板数码管电路"></center>

#### 2.2. 数码管扫描原理

单个数码管可以采用静态显示方式，如图所示，数码管被分成 a、b、c、d、e、f、g 和小数 点，每段可以单独控制亮灭，通过点亮不同的段显示不同的数字和字符。

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.2.jpg" alt="Fig-3.2"></center>

对于共阳极的数码管，显示数字和字符的编码如下：

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.3.jpg" alt="Fig-3.3"></center>

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.4.png" alt="Fig-3.4"></center>

对于多位数码管，利用视觉暂留原理，快速交替显示，让眼睛看上去是多个数码管同时显示的。

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.5.jpg" alt="Fig-3.5"></center>

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.6.jpg" alt="Fig-3.6"></center>

## 三、实验步骤及结果

### 1. 程序设计

本实验设计一个 2 位60进制计数器模块（由一个十进制计数器和一个六进制计数器实现）和一个2位24进制计数器模块，然后通过译码模块译码后送到数码管扫描模块扫描显示。

### 2. 模块设计

#### 2.1. 译码模块

主要作用是将二进制码转换成数码管的段控制信号。

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.7.png" alt="Fig-3.7 译码模块（seg_decoder）端口"></center>

#### 2.2. 数码管扫描模块

将多位数码管的段控制信号分时送出。

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.8.png" alt="Fig-3.8 数码管扫描模块（seg_scan）端口
"></center>

#### 2.3. 模 10 计数器模块

模块有同步复位，计数使能，进位输出功能，计数值从 0-9，并在等于 9 时进位。

#### 2.4. 模 6 计数器模块

模块有同步复位，计数使能，进位输出功能，计数值从 0-5，并在等于 5 时进位。

#### 2.5. 模 24 计数器模块

此模块右两部分构成，一部分是十位（count_m24_x）另一部分是个位（count_m24_y）。十位数字通过逢2进位实现24进制的“2”，个位数字通过两次十进制和一次五进制来实现24进制的“4”。

<center><img src="https://img.rimrose.work/EDA_expt-3_Fig3.11.png" alt="Fig-3.9 RTL"></center>

<center><img src="https://img.rimrose.work/EDA_expt-3_Fig3.10.png" alt="Fig-3.10 Flow Summary"></center>

<center><img src="https://img.rimrose.work/EDA_expt-2_Fig2.12.png" alt="Fig-3.11 simulation"></center>

> 附：完整代码

```Verilog
// 此代码基于实验二的seg_test.v
// 在实验二的seg_test.v的第129行后边插入以下代码：
    .seg_data_0 ({1'b1,seg_data_0}),      //The  decimal point at the highest bit,and low level effecitve
    .seg_data_1 ({1'b1,seg_data_1}), 
    .seg_data_2 ({1'b1,seg_data_2}),
    .seg_data_3 ({1'b1,seg_data_3}),
```

```Verilog
// 此代码基于实验二的seg_scan.v
// 在实验二的seg_scan模块代码的基础上进行以下修改：

// 在第5行后边插入：
 input[7:0]      seg_data_0,
 input[7:0]      seg_data_1,
 input[7:0]      seg_data_2,
 input[7:0]      seg_data_3,
 
// 在第49行后边插入
   //first digital led
   4'd0:
   begin
    seg_sel <= 6'b11_1110;
    seg_data <= seg_data_0;
   end
   //second digital led
   4'd1:
   begin
    seg_sel <= 6'b11_1101;
    seg_data <= seg_data_1;
   end
   //...
   4'd2:
   begin
    seg_sel <= 6'b11_1011;
    seg_data <= seg_data_2;
   end
   4'd3:
   begin
    seg_sel <= 6'b11_0111;
    seg_data <= seg_data_3;
   end
```

```Verilog
//count_m24_x.v
module count_m24_x(
                 input          clk,
                 input          rst_n,
                 input          en,    //Counter enable
                 input          clr,   //Counter synchronous reset   
                 output reg[3:0]data,  //counter value
                 output reg     t      // carry enable signal
                );
always@(posedge clk or negedge rst_n) 
begin
    if(rst_n==0)
    begin
        data <= 4'd0;
        t <= 1'd0;
    end
    else if(clr)
    begin
        data <= 4'd0;
        t <= 1'd0;      
    end
    else if(en)
    begin
        if(data==4'd2)
        begin
            t<= 1'b1;    //Counter to 2 to generate carry
            data <= 4'd0;//Counter to 2 reset
        end
        else
        begin
            t <= 1'b0;
            data <= data + 4'd1;
        end
    end
    else
        t <= 1'b0;
end
 
endmodule
```

```Verilog
//count_m24_y.v
module count_m24_y(
                 input          clk,
                 input          rst_n,
                 input          en,    //Counter enable
                 input          clr,   //Counter synchronous reset   
                 output reg[3:0]data,  //counter value
                 output reg     t      // carry enable signal
                );
      
reg[3:0] y_timer; // 24_y timer
 
always@(posedge clk or negedge rst_n)
begin
    if(rst_n==0)
    begin
        data <= 4'd0;
        t <= 1'd0;
    y_timer <= 4'd0;
    end
    else if(clr)
    begin
        data <= 4'd0;
        t <= 1'd0;
    y_timer <= 4'd0;    
    end
    else if(en)
    begin
        if(data==4'd9)
        begin
            t<= 1'b1;    //Counter to 9 to generate carry
            data <= 4'd0;//Counter to 9 reset
    y_timer <= y_timer + 4'd1; 
        end
    else if(data==4'd3 && y_timer==4'd2)
    begin
    t <= 1'b1;
    data <= 4'd0;
    y_timer <= 4'd0;
   end
        else
        begin
            t <= 1'b0;
            data <= data + 4'd1;
        end
    end
    else
        t <= 1'b0;
end
 
endmodule
```

> 然后，在`seg_test.v`里边，第89行的`wire t3`的`count_m10`改成`count_m6`，然后把第100行和111行的`wire t4`和`wire t5`的`count_m10`分别改为`count_m24_y`和`count_m24_x`即可实现。

## 四、实验中遇到的问题及解决方法

### 其一

时钟计数速度过慢（对于调试来说），解决方法是：

可以修改`seg_test.v`第45行的`32'd49_999_999`为`32'd49_999`，这样分钟的十位会按比秒稍微快一点的速度计数。

### 其二

如何实现24进制：

由于时钟的每一位数字是单独控制的，所以24进制通过两个数字分别控制来实现，也就是一部分是十位（count_m24_x）另一部分是个位（count_m24_y）。十位数字通过逢2进位实现24进制的“2”，个位数字通过两次十进制和一次五进制来实现24进制的“4”。

## 五、心得体会

这次的数字时钟设计实验是一个有趣且具有挑战性的任务。在设计过程中，我深刻体会到了模块化设计的重要性，以及如何将不同功能的模块协调工作。以下是我在这个实验中的一些感受：

模块化设计的优势：

通过将整个系统拆分为不同的模块，我们可以更好地管理复杂性。每个模块专注于特定的功能，使得代码更易于维护和调试。这次实验中，我学到了如何设计独立的计时模块和数码管显示模块，并将它们组合在一起。

时序控制的挑战：

在数码管显示模块中，动态扫描的时序控制是一个关键问题。我们需要确保数码管按照正确的顺序点亮，以显示出完整的时间。这让我意识到了时序设计的重要性，以及如何避免潜在的冲突。

仿真的重要性：

在设计过程中，我进行了详细的仿真测试。通过仿真，我能够观察到时、分、秒各自的跳变过程，并验证整点报时控制信号的正确性。这次实验让我明白了仿真在硬件设计中的关键作用。



（心得体会由newbing生成，望知悉）

---

<center><h1>实验四：正弦信号发生器设计</h1></center>

## 一、实验目的

1. 掌握ROM存储器 IP核的使用

2. 掌握IP核的仿真方法

3. 掌握signal Tap嵌入式逻辑分析仪的使用方法

## 二、实验内容及原理

### 1. 实验内容

产生一定频率的正弦信号，信号频率可设置或选择

### 2. 实验原理

首先是 FPGA 中的波形发生器控制电路，它通过外来控制信号和高速时钟 信号，向波形数据 ROM 发出地址信号。波形数据 ROM 中存有发生器的波形数据，如正弦 波或三角波数据。当接受来自 FPGA 的地址信号后，将从数据线输出相应的波形数据。

## 三、实验步骤及结果

1. 打开 Quartus 软件，点击 File，找到并点击 New Project Wizard，新建工程。为工程命名， 选择 Cyclone IV E 器件，将管脚个数选为 256，速度选 8，然后选中器件栏中的第一行器件。

2. 然后在界面的最右边 IP 核目录库下的 Basic Function 中找到 On Chip Memory，选择 ROM:1-PORT。然后出现一个窗口，为最后生成的文件命名，点击 OK。接着又出现一个界 面，主要是对 IP 核进行参数的设置，将位数设置为 8，将数据个数设置为 256 即可，点击 NEXT。在新出现的窗口中找到 Create a ‘rden’ read enable signal 打上对号，再点击 NEXT。 这时候需要添加存储器的初始化文件，注意该文件的后缀是.mif，然后继续往下进行，最后 结束。结束后又出现一个窗口，窗口主要是询问刚才生成的 IP 核文件是否加入工程里，点 击 YES，在当行窗口点击 Files 即可看到自动生成的文件。

3. 使用 IP 核。新建文件，写入程序代码。具体代码如下:

```Verilog
//sinwave1.v
module sinwave1(clk, rst_n, dout);
input clk, rst_n;
output [7:0] dout;
reg [7:0] address;
reg rden;
always@(posedge clk or negedge rst_n)
begin
    if (!rst_n)
        rden ≤0;
    else
        rden ≤1;
end
always@(posedge clk or negedge rst_n)
begin
    if (!rst_n)
        address≤0;
    else
        address ≤address+1;
end
myrom1 u1(.address(address) ,.clock(clk) ,.rden(rden),.q(dout));
endmodule
```

4. 使用 Signal Tap Logic Analyzer File。点击 File-->new-->Signal Tap Logic Analyzer File-->OK。在出现的界面做三个设置，第一个：双击空白窗口，在出现的窗口中 Filter 找到 Pins all 并点击选择，再点击 list，然后选择 dout-->insert-->closed；第二个：窗口右边找到 Clock-->…-->Filter-->Pins all-->list-->clk-->insert-->OK；第三个：在右边窗口，找到 Sample depth 将其改为 1K，即可。然后保存。接着出现一个窗口提示是否把当前这个加入工程里， 点击 YES。再次编译。结果如下图示。

<center><img src="https://img.rimrose.work/EDA_expt-4_Fig2.jpg" alt="Fig-2 Flow Summary"></center>

5. 把电路板的与电脑连接。然后在刚才的界面右边找到 Hardware-->USB-Blaster,然后选择 需要下载的文件，点击下载的图标，然后程序就下载进去了，接着点击运行，然后波形就出现了。右键点击 dout[7:0]-->Bus Display Format-->Unsigned Line Chart， 即可看到正弦波，如下图示。

<center><img src="https://img.rimrose.work/EDA_expt-4_Fig3.png" alt="Fig-3 wave"></center>
<div></div>
<center><img src="https://img.rimrose.work/EDA_expt-4_Fig4.png" alt="Fig-4 RTL图"></center>

## 四、实验中遇到的问题及解决方法

遇到的问题主要在于软件使用上的操作问题，经过点击不同的位置试错之后解决问题。

## 五、心得体会

我将波形数据存入FPGA的ROM中，同时在FPGA中实现了外部控制逻辑单元，通过仿真测试，我成功地实现了正弦信号发生器的设计要求。这次实验让我更深入地理解了数字电路设计和信号处理的原理。

---

<center><h1>实验五：任意波形发生器设计</h1></center>

## 一、实验目的

1. 熟练掌握IP核的使用

2. 掌握自上而下的电路设计方法


## 二、实验内容及原理

### 1. 实验内容

1. 生成4种基本波形，例如正弦波、方波等，具体波形和参数自定。

2. 输出4种基本波形的任意叠加结果，共16种波形可供选择。

### 2. 实验原理

- **模块输入和输出：**

    - 输入：时钟信号clk和复位信号rst。
    - 输出：共有15个输出信号，分别是q1到q15，它们的位宽分别为8位到11位。

- **寄存器address：**

    - 定义了一个9位宽的寄存器address，用于存储地址信息。

    - 在每个时钟下降沿或复位信号下降沿时，根据复位状态更新 address 的值。

- **四个ROM模块：**

    - sinewave、fangbo、jvchibo和sanjiaobo是四个 ROM 模块。

    - 每个模块都有相同的输入信号address和时钟信号clk，以及不同的输出信号q1、q2、q3和q4。

    - 这些模块根据给定的地址从ROM中读取数据，并将结果存储在相应的输出信号中。

- **输出信号的计算：**
    - q5到q15是通过对输入信号q1、q2、q3和q4进行不同的运算得到的。
    - 例如，q5是q1和q2的和，q6是q1和q3的和，以此类推。

总之，这段代码实现了一个多输出的模块，其中包含了四个ROM模块和一些逻辑运算。每个ROM模块根据地址从ROM中读取数据，并将结果存储在相应的输出信号中。

（实验原理部分的内容由newbing生成，望知悉）


## 三、实验步骤及结果

0. 新建工程与波形文件生成不再赘述，之前实验中已经说明。

1. 在IP核库里的Basic Function – On Chip Memory，选择ROM:1-PORT，为每一个波形对应的实例化ROM核命名，比如本程序里将正弦波对应的ROM核命名为“sinewave”，对应的就是“sinewave.qip”和“sinewave.v”，然后一直点next，在需要选择波形文件以进行初始化时选择在步骤0中生成的正弦波文件，然后继续next。最后在询问是否将刚才生成的IP核加入工程的窗口点击YES，这样即可在Files里看到刚刚生成的文件，如Fig-1所示。

<center><img src="https://img.rimrose.work/EDA_expt-5_Fig1.png" alt="Fig-1 Files"></center>

2. 重复步骤1，将另外的三个波形也写入ROM核。

3. 编写顶层文件，完整代码如下。

```verilog
//hechengbo.v
module hechengbo(
    input clk,
    input rst,
    output [7:0] q1,
    output [7:0] q2, 
    output [7:0] q3, 
    output [7:0] q4, 
    output [8:0] q5, 
    output [8:0] q6, 
    output [8:0] q7, 
    output [8:0] q8, 
    output [8:0] q9, 
    output [8:0] q10,
    output [9:0] q11,
    output [9:0] q12, 
    output [9:0] q13, 
    output [9:0] q14, 
    output [10:0] q15 
);

reg [8:0] address;

    always @ (negedge clk or negedge rst)
begin
    if(!rst)
       address <= 1'b0;
    else
       address <= address+1'b1;
end
sinewave       ROM_1
(
 .address(address),
 .clock (clk),
 .q (q1)
);
fangbo     ROM_2
(
 .address(address),
 .clock (clk),
 .q (q2)
);
jvchibo    ROM_3
(
 .address(address),
 .clock (clk),
 .q (q3)
);
sanjiaobo   ROM_4
(
 .address(address),
 .clock (clk),
 .q (q4)
);
assign q5=q1+q2;
assign q6=q1+q3;
assign q7=q1+q4;
assign q8=q3+q2;
assign q9=q4+q2;
assign q10=q1+q3+q4;
assign q11=q1+q2+q3;
assign q12=q1+q2+q4;
assign q13=q2+q3+q4;
assign q14=q3+q4;
assign q15=q1+q2+q3+q4;

endmodule
```

4. 使用 Signal Tap Logic Analyzer File。点击 File-->new-->Signal Tap Logic Analyzer File-->OK。在出现的界面做两个设置，第一个：双击空白窗口，在出现的窗口中 Filter 找到 Pins all 并点击选择，再点击 list，然后选择 q1~q15-->insert-->closed；第二个：窗口右边找到 Clock-->…-->Filter-->Pins all-->list-->clk-->insert-->OK。然后保存。接着出现一个窗口提示是否把当前这个加入工程里， 点击 YES。编译。结果如下图示。

<center><img src="https://img.rimrose.work/EDA_expt-5_Fig2.jpg" alt="Fig-2 Flow Summary"></center>

5. 把电路板的与电脑连接。然后在刚才的界面右边找到 Hardware-->USB-Blaster,然后选择 需要下载的文件，点击下载的图标，然后程序就下载进去了，接着点击运行，然后波形就出现了。按ctrl+A全选节点q1~q15-->Bus Display Format-->Unsigned Line Chart，即可看到q1~q4四个基本波形以及q5~q15的波形合成结果，如下图示。

<center><img src="https://img.rimrose.work/EDA_expt-5_Fig3.png" alt="Fig-3 Signal Tap运行结果"></center>
<div></div>
<center><img src="https://img.rimrose.work/EDA_expt-5_Fig4.png" alt="Fig-4 RTL图"></center>
<div></div>
<center><img src="https://img.rimrose.work/EDA_expt-5_Fig5.png" alt="Fig-5 Pin Planner配置图"></center>

## 四、实验中遇到的问题及解决方法

Signal Tap运行之后看不到波形，看到的不是正弦形状等。解决方法就是Bus Display Format-->Unsigned Line Chart，将波形显示模式改为Line Chart。

## 五、心得体会

学到了一些逻辑运算，以下是一些常见的逻辑运算：

- 与运算（AND）：

AND 运算将两个输入值进行比较，如果两者都为真，则结果为真；否则，结果为假。

例如，如果输入 A 和输入 B 都为真，那么 A AND B 的结果为真。

- 或运算（OR）：

OR 运算将两个输入值进行比较，如果其中至少一个为真，则结果为真；否则，结果为假。

例如，如果输入 A 或输入 B 中至少有一个为真，那么 A OR B 的结果为真。

- 非运算（NOT）：

NOT 运算将单个输入值进行比较，如果输入为真，则结果为假；如果输入为假，则结果为真。

例如，如果输入 A 为真，那么 NOT A 的结果为假。

- 异或运算（XOR）：

XOR 运算也称为“互斥或”运算。它将两个输入值进行比较，如果两者不相等，则结果为真；如果两者相等，则结果为假。

例如，如果输入 A 和输入 B 不相等，那么 A XOR B 的结果为真。

学到了如何进行波的叠加运算。

（心得体会由newbing生成，望知悉）

---
<center><h1>实验六：硬件消抖电路设计</h1></center>

## 一、实验目的

1. 熟悉硬件消抖原理

2. 熟悉状态机的设计方法

## 二、实验内容及原理

### 1. 实验内容：

每按一次按键，数码管显示的60进制计数结果加1

### 2. 实验原理:

（此部分内容由newbing生成，望知悉）

- **顶层文件key_debounce模块**
    - 模块输入和输出：
        - 输入：时钟信号 clk、复位信号 rst_n 和按键输入信号 key1。
        - 输出：6 位选择信号 seg_sel 和 8 位的七段显示数据信号 seg_data。
    - 按键去抖动逻辑：
        - 使用 ax_debounce 模块对输入的按键信号 key1 进行去抖动处理。
        - button_negedge 是检测到按键下降沿的信号。
        - 去抖动后的输出作为计数器的使能信号。
    - 两个计数器：
        - count10_m0 和 count10_m1 是两个 4 位计数器。
        - count10_m0 在去抖动后的按键下降沿触发，用于计数按键按下的次数。
        - count10_m1 在 t0（从 count10_m0 得到的进位信号）为高电平时触发，用于进一步计数。
    - 计数器值解码：
        - 两个 seg_decoder 模块将计数器的值（count 和 count1）解码为 7 段显示数据。
        - 解码后的数据存储在 seg_data_0 和 seg_data_1 中。
    - 7 段扫描：
        - seg_scan 模块扫描 7 段显示。
        - 它选择六个段之一（由 seg_sel 控制），并提供相应的数据（seg_data）。

- **按键消抖ax_debounce模块：**
    - 模块输入和输出：
        - 输入：时钟信号 clk、复位信号 rst 和按键输入信号 button_in。
        - 输出：去抖动后的按键信号 button_out，以及按键上升沿和下降沿的标志 button_posedge 和 button_negedge。
    - 内部常数和变量：
        - N：去抖动计时器的位宽。
        - FREQ：模型时钟频率（以 MHz 为单位）。
        - MAX_TIME：最大去抖动时间（以毫秒为单位）。
        - TIMER_MAX_VAL：计时器的最大值，根据最大去抖动时间计算得出。
    - 计时器控制：
        - q_reset：通过异或运算检测输入翻转，用于重置计时器。
        - q_add：当 q_reg 的最高位为 0 时，允许计数器增加。
    - 计数器逻辑：
        - q_next：根据 q_reset 和 q_add 计算下一个计数器值。
        - DFF1 和 DFF2：输入的触发器。
        - q_reg：计数器的当前值。
    - 按键输出控制：
        - button_out：在计数器达到最大值时，将按键输出设置为 DFF2 的值。
        - button_out_d0：按键输出的初始值。
        - button_posedge 和 button_negedge：用于检测按键上升沿和下降沿。

- **4位6进制计数器count_m6模块**
    - 模块输入和输出：
        - 输入：时钟信号 clk、复位信号 rst_n、计数器使能信号 en 和同步清零信号 clr。
        - 输出：4 位计数器值 data 和进位使能信号 t。
    - 计数器逻辑：在时钟上升沿或复位信号下降沿时，执行以下操作：
        - 如果复位信号 rst_n 为低电平（0），则将计数器值 data 和进位使能信号 t 都重置为 0。
        - 如果同步清零信号 clr 为高电平（1），也将计数器值 data 和进位使能信号 t 都重置为 0。
        - 如果计数器使能信号 en 为高电平（1）：
        - 如果计数器值 data 等于 5，将进位使能信号 t 设置为 1（用于产生进位）并将计数器值 data 重置为 0。
        - 否则，将进位使能信号 t 设置为 0，计数器值 data 加 1。
        - 否则，将进位使能信号 t 设置为 0。
    - 计数器行为：
        - 计数器从 0 开始计数，每次递增 1。
        - 当计数器值达到 5 时，产生进位信号 t 并将计数器值重置为 0。

- **4位10进制计数器count_m10模块**

    - 原理与上边的6进制计数器一样，只是进位的数字不一样。

- **解码模块seg_decoder，用于将 4 位二进制输入 bin_data 解码为七段显示的输出 seg_data**

    - always 块：
        - 这个模块中的 always 块是组合逻辑，它在任何输入变化时都会执行。
        - always @(*) 表示敏感于所有输入信号的变化。
    - case 语句：
        - case(bin_data) 根据输入的 bin_data 的值进行匹配。
        - 对于每个可能的 bin_data 值，都有一个对应的七段显示模式。
    - 七段显示模式：
        - 七段显示器通常由 7 个段（a、b、c、d、e、f、g）组成，每个段可以点亮或熄灭。
        - 在这里，七段显示的每个段用一个位表示，其中 1 表示点亮，0 表示熄灭。
        - 每个 seg_data 的 7 位对应于 a、b、c、d、e、f、g 段的状态。
    - 具体的解码：
        - 例如，当 bin_data 为 4’d0（表示十进制 0）时，seg_data 被设置为 7’b100_0000（点亮 a 段，其他段熄灭，显示数字 0）。
        - 类似地，对于其他的 bin_data 值，都有相应的七段显示模式。
    - 默认情况：
        - 如果 bin_data 的值不在 0 到 15 之间，default 分支将 seg_data 设置为 7’b111_1111（所有段都熄灭）。

- **扫描模块seg_scan，用于控制七段显示器的扫描**
    - 模块输入和输出：

        - 输入：时钟信号 clk、复位信号 rst_n 和六个七段显示器的数据信号 seg_data_0 到 seg_data_5。
        - 输出：6 位选择信号 seg_sel 和 8 位的七段显示数据信号 seg_data。
    - 计时器和选择逻辑：
        - scan_timer 是一个 32 位计时器，用于控制扫描的时间。
        - scan_sel 是一个 4 位计数器，用于选择要扫描的七段显示器。
    - 计时器和选择逻辑的实现：  在时钟上升沿或复位信号下降沿时，执行以下操作：
        - 如果复位信号 rst_n 为低电平（0），则重置计时器和选择计数器。
        - 如果计时器达到预定的扫描周期（SCAN_COUNT），则重置计时器并更新选择计数器。
        - 否则，继续递增计时器。
    - 七段显示器选择和数据输出：
        - 根据选择计数器的值，选择要扫描的七段显示器。
        - 每个选择对应一个七段显示器的段选信号 seg_sel 和相应的数据 seg_data。
        - 例如，当 scan_sel 为 4’d0 时，选择第一个七段显示器，设置 seg_sel 为 6’b11_1110，并将 seg_data 设置为 seg_data_0。
    - 默认情况：
        - 如果选择计数器的值不在 0 到 5 之间，将 seg_sel 设置为 6’b11_1111，并将 seg_data 设置为 8’hff（所有段都熄灭）。

## 三、实验步骤及结果

编写程序代码编译即可。各模块代码按照实验原理中的模块顺序依次如下：

```Verilog
//key_debounce.v
module key_debounce(
    input        clk,
    input        rst_n,
    input        key1,
    output [5:0] seg_sel,
    output [7:0] seg_data
);
wire button_negedge; //Key falling edge
ax_debounce ax_debounce_m0
(
    .clk             (clk),
    .rst             (~rst_n),
    .button_in       (key1),
    .button_posedge  (),
    .button_negedge  (button_negedge),
    .button_out      ()
);

wire[3:0] count;
wire t0;
count_m10 count10_m0(
    .clk    (clk),
    .rst_n  (rst_n),
    .en     (button_negedge),
    .clr    (1'b0),
    .data   (count),
    .t      (t0)
);
wire[3:0] count1;
wire t1;
count_m6 count10_m1(
    .clk    (clk),
    .rst_n  (rst_n),
    .en     (t0),
    .clr    (1'b0),
    .data   (count1),
    .t      (t1)
);
//Count decoding
wire[6:0] seg_data_0;
seg_decoder seg_decoder_m0(
    .bin_data  (count),
    .seg_data  (seg_data_0)
);

wire[6:0] seg_data_1;
seg_decoder seg_decoder_m1(
    .bin_data  (count1),
    .seg_data  (seg_data_1)
);
seg_scan seg_scan_m0(
    .clk        (clk),
    .rst_n      (rst_n),
    .seg_sel    (seg_sel),
    .seg_data   (seg_data),
    .seg_data_0 ({1'b1,7'b1111_111}),
    .seg_data_1 ({1'b1,7'b1111_111}),
    .seg_data_2 ({1'b1,7'b1111_111}),
    .seg_data_3 ({1'b1,7'b1111_111}),
    .seg_data_4 ({1'b1,seg_data_1}),
    .seg_data_5 ({1'b1,seg_data_0})
);
endmodule 
```

```Verilog
//ax_debounce.v
`timescale 1 ns / 100 ps
module  ax_debounce 
(
    input       clk, 
    input       rst, 
    input       button_in,
    output reg  button_posedge,
    output reg  button_negedge,
    output reg  button_out
);
//// ---------------- internal constants --------------
parameter N = 32 ;           // debounce timer bitwidth
parameter FREQ = 50;         //model clock :Mhz
parameter MAX_TIME = 20;     //ms
localparam TIMER_MAX_VAL =   MAX_TIME * 1000 * FREQ;
////---------------- internal variables ---------------
reg  [N-1 : 0]  q_reg;      // timing regs
reg  [N-1 : 0]  q_next;
reg DFF1, DFF2;             // input flip-flops
wire q_add;                 // control flags
wire q_reset;
reg button_out_d0;
//// ------------------------------------------------------

////contenious assignment for counter control
assign q_reset = (DFF1  ^ DFF2);          // xor input flip flops to look for level chage to reset counter
assign q_add = ~(q_reg == TIMER_MAX_VAL); // add to counter when q_reg msb is equal to 0
    
//// combo counter to manage q_next 
always @ ( q_reset, q_add, q_reg)
begin
    case( {q_reset , q_add})
        2'b00 :
                q_next <= q_reg;
        2'b01 :
                q_next <= q_reg + 1;
        default :
                q_next <= { N {1'b0} };
    endcase     
end

//// Flip flop inputs and q_reg update
always @ ( posedge clk or posedge rst)
begin
    if(rst == 1'b1)
    begin
        DFF1 <= 1'b0;
        DFF2 <= 1'b0;
        q_reg <= { N {1'b0} };
    end
    else
    begin
        DFF1 <= button_in;
        DFF2 <= DFF1;
        q_reg <= q_next;
    end
end

//// counter control
always @ ( posedge clk or posedge rst)
begin
    if(rst == 1'b1)
       button_out <= 1'b1;
    else if(q_reg == TIMER_MAX_VAL)
        button_out <= DFF2;
    else
        button_out <= button_out;
end

always @ ( posedge clk or posedge rst)
begin
    if(rst == 1'b1)
    begin
       button_out_d0 <= 1'b1;
       button_posedge <= 1'b0;
       button_negedge <= 1'b0;
    end
    else
    begin
       button_out_d0 <= button_out;
       button_posedge <= ~button_out_d0 & button_out;
       button_negedge <= button_out_d0 & ~button_out;
    end    
end
endmodule
```

```Verilog
//count_m6.v
module count_m6(
                 input          clk,
                 input          rst_n,
                 input          en,    //Counter enable
                 input          clr,   //Counter synchronous reset   
                 output reg[3:0]data,  //counter value
                 output reg     t      // carry enable signal
                );
always@(posedge clk or negedge rst_n) 
begin
    if(rst_n==0)
    begin
        data <= 4'd0;
        t <= 1'd0;
    end
    else if(clr)
    begin
        data <= 4'd0;
        t <= 1'd0;      
    end
    else if(en)
    begin
        if(data==4'd5)
        begin
            t<= 1'b1;    //Counter to 5 to generate carry
            data <= 4'd0;//Counter to 5 reset
        end
        else
        begin
            t <= 1'b0;
            data <= data + 4'd1;
        end
    end
    else
        t <= 1'b0;
end

endmodule
```

```Verilog
//count_m10.v
module count_m10(
                 input          clk,
                 input          rst_n,
                 input          en,    //Counter enable
                 input          clr,   //Counter synchronous reset   
                 output reg[3:0]data,  //counter value
                 output reg     t      // carry enable signal
                );
always@(posedge clk or negedge rst_n) 
begin
    if(rst_n==0)
    begin
        data <= 4'd0;
        t <= 1'd0;
    end
    else if(clr)
    begin
        data <= 4'd0;
        t <= 1'd0;      
    end
    else if(en)
    begin
        if(data==4'd9)
        begin
            t<= 1'b1;    //Counter to 9 to generate carry
            data <= 4'd0;//Counter to 9 reset
        end
        else
        begin
            t <= 1'b0;
            data <= data + 4'd1;
        end
    end
    else
        t <= 1'b0;
end

endmodule
```

```Verilog
//seg_decoder.v
module seg_decoder
(
    input[3:0]      bin_data,     // bin data input
    output reg[6:0] seg_data      // seven segments LED output
);

always@(*)
begin
    case(bin_data)
       4'd0:seg_data <= 7'b100_0000;
       4'd1:seg_data <= 7'b111_1001;
       4'd2:seg_data <= 7'b010_0100;
       4'd3:seg_data <= 7'b011_0000;
       4'd4:seg_data <= 7'b001_1001;
       4'd5:seg_data <= 7'b001_0010;
       4'd6:seg_data <= 7'b000_0010;
       4'd7:seg_data <= 7'b111_1000;
       4'd8:seg_data <= 7'b000_0000;
       4'd9:seg_data <= 7'b001_0000;
       4'ha:seg_data <= 7'b000_1000;
       4'hb:seg_data <= 7'b000_0011;
       4'hc:seg_data <= 7'b100_0110;
       4'hd:seg_data <= 7'b010_0001;
       4'he:seg_data <= 7'b000_0110;
       4'hf:seg_data <= 7'b000_1110;
       default:seg_data <= 7'b111_1111;
    endcase
end
endmodule
```

```Verilog
//seg_scan.v
module seg_scan(
    input           clk,
    input           rst_n,
    output reg[5:0] seg_sel,      //digital led chip select
    output reg[7:0] seg_data,     //eight segment digital tube output,MSB is the decimal point
    input[7:0]      seg_data_0,
    input[7:0]      seg_data_1,
    input[7:0]      seg_data_2,
    input[7:0]      seg_data_3,
    input[7:0]      seg_data_4,
    input[7:0]      seg_data_5
);
parameter SCAN_FREQ = 200;     //scan frequency
parameter CLK_FREQ = 50000000; //clock frequency

parameter SCAN_COUNT = CLK_FREQ /(SCAN_FREQ * 6) - 1;

reg[31:0] scan_timer;  //scan time counter
reg[3:0] scan_sel;     //Scan select counter
always@(posedge clk or negedge rst_n)
begin
    if(rst_n == 1'b0)
    begin
       scan_timer <= 32'd0;
       scan_sel <= 4'd0;
    end
    else if(scan_timer >= SCAN_COUNT)
    begin
       scan_timer <= 32'd0;
       if(scan_sel == 4'd5)
          scan_sel <= 4'd0;
       else
          scan_sel <= scan_sel + 4'd1;
    end
    else
       begin
          scan_timer <= scan_timer + 32'd1;
       end
end
always@(posedge clk or negedge rst_n)
begin
    if(rst_n == 1'b0)
    begin
       seg_sel <= 6'b111111;
       seg_data <= 8'hff;
    end
    else
    begin
       case(scan_sel)
          //first digital led
          4'd0:
          begin
             seg_sel <= 6'b11_1110;
             seg_data <= seg_data_0;
          end
          //second digital led
          4'd1:
          begin
             seg_sel <= 6'b11_1101;
             seg_data <= seg_data_1;
          end
          //...
          4'd2:
          begin
             seg_sel <= 6'b11_1011;
             seg_data <= seg_data_2;
          end
          4'd3:
          begin
             seg_sel <= 6'b11_0111;
             seg_data <= seg_data_3;
          end
          4'd4:
          begin
             seg_sel <= 6'b10_1111;
             seg_data <= seg_data_4;
          end
          4'd5:
          begin
             seg_sel <= 6'b01_1111;
             seg_data <= seg_data_5;
          end
          default:
          begin
             seg_sel <= 6'b11_1111;
             seg_data <= 8'hff;
          end
       endcase
    end
end

endmodule
```

运行结果：

<center><img src="https://img.rimrose.work/EDA_expt-6_Fig1.png" alt="Fig-1 Flow Summary"></center>
<div></div>
<center><img src="https://img.rimrose.work/EDA_expt-6_Fig2.png" alt="Fig-2 RTL图"></center>
<div></div>
<center><img src="https://img.rimrose.work/EDA_expt-6_Fig3.png" alt="Fig-3 Pin Planner配置"></center>

实际结果就是每按一次按键，数码管上的数字+1。

## 四、实验中遇到的问题及解决方法

这次实验采用了demo中的按键消抖解决方案，并未遇到什么问题。

## 五、心得体会

按键去抖动的原理：

按键在物理上按下或释放时，可能会产生多个电平变化，导致微小的抖动。

去抖动的目标是确保只有一个有效的按键状态被记录，而不受抖动的影响。

硬件去抖动：

硬件去抖动通常使用 RC 电路或者 Schmitt 触发器来实现。

RC 电路通过电容和电阻的组合，延迟电平变化，从而减少抖动。

Schmitt 触发器具有两个阈值电平，可以有效地抑制抖动。

软件去抖动：

软件去抖动通常在数字电路中使用。

我们可以使用计数器来跟踪按键状态的持续时间，只有在一定时间内保持稳定状态时才认为按键有效。

这需要合理的计时器设计和状态机控制。

Verilog HDL 中的实现：

在 Verilog HDL 中，我们可以使用 always 块来实现按键去抖动逻辑。

计数器、状态机和选择逻辑都可以在 Verilog 中方便地实现。


（心得体会由newbing生成，望知悉）