# PiBot

树莓派视频遥控小车，带iOS和Android应用和网页应用。

## 演示

![App](/images/pibotapp.gif)

## 界面

![App](/images/pibotappcn.png)

![Web](/images/pibotwebcn.png)

## 组装

![Assembly](/images/assembly.gif)

## 元件

* **树莓派**: Raspberry Pi v3 Model B

* **树莓派摄像头**: 8MP Raspberry Pi Camera v2

* **Micro SD 内存卡**

  8G 或以上.

* **USB 声卡**

  我用的是[这个](https://detail.tmall.com/item.htm?id=43007935397)

* **麦克风**

  3.5mm 接口，我用的是[这个](https://detail.tmall.com/item.htm?id=21808596718)

* **扬声器**

  3.5mm 接口迷你扬声器

* **小车底盘**: ZK-4WD

* **马达驱动**: L298n

* **5v电源**

  给树莓派供电

* **电池电源**

  两节 18650 (3.7v) 电池加电池壳，给马达驱动供电

* **DC降压模块**: LM2596S

  7.4v 转 5v，给舵机供电

* **舵机**: SG90 9g

* **舵机底座**

  我用的是[这个](https://item.taobao.com/item.htm?id=531675916868)，但只用了单层，因为树莓派只有 2 组硬件 PWM，需要留一组给红外输出

* **红外发射模块**

  可以用 Arduino 的红外发射模块 KY-005，但是可达距离较短。

  推荐[这个](https://item.taobao.com/item.htm?id=38698599143)大功率红外模块，距离可达几米。

* **红外接收模块**: KY-022 (IR Receiver for Arduino)

* **面包板**: SYB-170

* **杜邦线**

  20 或 30 厘米，公对母

* **电阻**

  1/4W 1kΩ & 2kΩ.

## 电路图

### Motor Driver and Motors

马达驱动和马达

9v 电源实际上是 2 节两节 18650 电池

![Motor Schematic](/images/motor_schem.png)

![Motor BreadBoard](/images/motor_bb.png)

### Servo

舵机

9v 电源实际上是两节 18650 电池

![Servo Schematic](/images/servo_schem.png)

![Servo BreadBoard](/images/servo_bb.png)

### Temperature and Humidity Sensor

温湿度传感器

![Temperature and Humidity Sensor Schematic](/images/temp_hum_schem.png)

![Temperature and Humidity Sensor BreadBoard](/images/temp_hum_bb.png)

### IR Receiver

红外接收模块

![IR Receiver Schematic](/images/ir_receiver_schem.png)

![IR Receiver BreadBoard](/images/ir_receiver_bb.png)

### IR Transmitter

红外发射模块

![IR Transmitter Schematic](/images/ir_sender_schem.png)

![IR Transmitter BreadBoard](/images/ir_sender_bb.png)

## 设置树莓派和网络

### 1） 安装树莓派系统 (Mac)

* (可选) 格式化 SD 卡

  1. 安装 [SD Card Formatter](https://www.sdcard.org/downloads/formatter_4/)。

  2. 打开 ***SD Card Formatter*** 选择 ***Overwrite Format***。

  3. 点击 ***Format***。

* 从镜像安装 Raspbian ([官方文档](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md))

  1. 下载 .zip 文件 [RASPBIAN STRETCH WITH DESKTOP](https://www.raspberrypi.org/downloads/raspbian/)。

  2. 解压并得到 *2017-07-05-raspbian-jessie.img*。

  3. 打开终端，运行```diskutil list```列出所有 disk。

  4. SD 卡插入读卡器并连接电脑。

  5. 再次运行```diskutil list```，找到 SD 卡的 disk (并非 partition)，比如 *disk3*，而不是 *disk3s1*。

  6. 运行```sudo diskutil unmountDisk /dev/disk[n]```解挂SD卡 (将 [n] 替换为上一步得到的 disk 编号，比如：*/dev/disk3*)。

  7. 将镜像拷贝至 SD 卡：```sudo dd bs=1m if=[path-to-the-image-file] of=/dev/rdisk[n] conv=sync``` (替换 [path-to-the-image-file] 为镜像文件路径，例如 *~/Downloads/2017-07-05-raspbian-jessie.img*, 并将 [n] 替换为正确的 disk 编号，比如： */dev/rdisk3*)。


### 2) SSH至Raspberry Pi ([官方文档](https://www.raspberrypi.org/documentation/remote-access/ssh/))

 1. 启用SSH:

    2016 年 11 月之后发布的 Raspbian 默认关闭了 SSH，启用方式是在 SD 卡的根目录创建一个名为 ***ssh*** 的文件，不带任何扩展名。

 2. 从电脑弹出 SD 卡，并插入树莓派。

 3. 将树莓派用网线连接至家用路由器，并用5v电源给树莓派供电。

 4. 找到树莓派的IP。如果没有路由器的权限，可以运行```sudo nmap -sP -PI -PT 192.168.1.0/24```扫描家庭网络中的所有设备。

 5. 打开终端，运行```ssh pi@[IP-of-Raspberry-Pi]``` (将 [IP-of-Raspberry-Pi] 替换为实际的 IP 地址，比如：*192.168.1.16*)，输入默认密码 ***raspberry***。

 6. (可选) 修改密码：```passwd pi```。

### 3) (可选) 配置图形远程桌面 ([官方文档](https://www.raspberrypi.org/documentation/remote-access/vnc/))

1. 如未安装 VNC connect，运行：

  ```
  sudo apt-get update
  sudo apt-get install realvnc-vnc-server realvnc-vnc-viewer
  ```

2. 启用 VNC Server，运行```sudo raspi-config```，选择 ***Interfacing Options***，选择 ***VNC*** > ***Yes***。

3. 打开 [VNC Viewer](https://www.realvnc.com/en/connect/download/viewer/)，输入树莓派的IP地址并连接。

### 4) 连接 Wifi ([官方文档](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md))

1. 运行```cat /etc/network/interfaces```，确认已存在以下内容：
  ```
  iface wlan0 inet manual
      wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
  ```

2. 运行```sudo vi /etc/wpa_supplicant/wpa_supplicant.conf```，在最底下添加
  ```
  network={
      ssid="{Name-of-the-Wifi}"
      psk="{Password-of-the-Wifi}"
  }
  ```

3. 运行```sudo service networking restart```以生效，设置完成后可拔出网线。

## 安装必要软件

### 1) Python 3.x

如果```which python3```返回空，运行```sudo apt-get install python3```。

### 2) NodeJs 8.x

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install nodejs
node -v
```

### 3) Nginx Server

安装 nginx：```sudo apt-get install nginx```，开启服务器```sudo /etc/init.d/nginx start```。

### 4) 音频视频相关

安装 ALSA 开发库: ```sudo apt-get install libasound2-dev```。如果返回 404，先运行```sudo apt-get upgrade --fix-missing```。

*avconv* 用来转换录像为 .mp4 格式：```sudo apt-get install libav-tools```

*mpg123* 用来播放 .mp3：```sudo apt-get install mpg123```

### 5) 下载 repo

```
cd ~
git clone https://github.com/shaqian/PiBot.git
```

## 测试硬件

### 1) 马达驱动及马达

> 测试马达时不要安装轮子

1. 按[电路图](#motor-driver-and-motors)接线。

2. 安装 [rpio](https://github.com/jperkin/node-rpio)，运行```npm install rpio```.

3. 运行```node```.

4. 初始化端口输出:
  ```
  var rpio = require('rpio');
  rpio.open(29, rpio.OUTPUT, rpio.LOW);
  rpio.open(31, rpio.OUTPUT, rpio.LOW);
  rpio.open(38, rpio.OUTPUT, rpio.LOW);
  rpio.open(40, rpio.OUTPUT, rpio.LOW);
  ```

5. 前进:
  ```
  rpio.write(29, rpio.LOW);
  rpio.write(31, rpio.HIGH);
  rpio.write(38, rpio.LOW);
  rpio.write(40, rpio.HIGH);
  ```

6. 后退:
  ```
  rpio.write(29, rpio.HIGH);
  rpio.write(31, rpio.LOW);
  rpio.write(38, rpio.HIGH);
  rpio.write(40, rpio.LOW);
  ```

7. 停止:
  ```
  rpio.write(29, rpio.LOW);
  rpio.write(31, rpio.LOW);
  rpio.write(38, rpio.LOW);
  rpio.write(40, rpio.LOW);
  ```

### 2) 舵机

1. 按[电路图](#servo)接线。

2. 运行:
  ```
  cd ~/PiBot/PiBotServer/bin
  chmod +x direct.py
  ```

3. 舵机角度由 duty cycle 控制，一般范围为 2.5 至 11.5。转至中间:
  ```
  ./direct.py 7
  ```

4. 左转到底：
  ```
  ./direct.py 2.5
  ```

5. 右转到底：
  ```
  ./direct.py 11.5
  ```

### 3) 温湿度传感器

1. 按[电路图](#temperature-and-humidity-sensor)接线。

2. 运行:
  ```
  cd ~/PiBot/PiBotServer/bin/temp_hum
  chmod +x getTemp.py
  chmod +x getHum.py
  ```

3. 获取温度:
  ```
  ./getTemp.py
  ```

4. 获取湿度:
  ```
  ./getHum.py
  ```

### 4) 红外接收模块

> 红外接收模块用来接收和解码遥控器信号，然后树莓派发送相同信号即可模拟遥控器。

> 代码借用[这个 repo](https://github.com/tanhangbo/RaspberryIR)，修改了端口，以及 ST_BASE 的值，树莓派 3 (BCM2837) 为 0x3F003000 ，而旧版为 0x20003000。

1. 按[电路图](#ir-receiver)接线。

2. 运行```gpio -v```检查是否已安装 wiringPi。没有的话，安装[Wiring Pi](http://wiringpi.com/download-and-install/).

3. 运行```cd ~/PiBot/PiBotServer/bin```。编译代码生成可执行文件：
  ```
  gcc ir_decode.c -lwiringPi -o decode.out
  chmod +x decode.out
  ```

4. 运行```sudo ./decode.out```。没有信号时屏幕每秒打印 *[0]*。

5. 将遥控器对准红外接收模块并按键。解码后的信号为一串十六进制数，如：*0xb2,0x4d,0x1f,0xe0,0x98,0x67,[48]*。

6. 重复以上步骤，解码空调开机和关机的信号。

### 5) 红外发射模块

> 红外解码完成后移除红外接收模块

1. 按[电路图](#ir-transmitter)接线。

2. 运行以下命令复制编码代码：
  ```
  cd ~/PiBot/PiBotServer/bin
  cp ir_encode.c on.c
  cp ir_encode.c off.c
  ```

3. 运行 ```vi on.c```，将 166 行的十六进制数改为解码所得的开机信号，如：
  ```
  char data[6] = {0xb2,0x4d,0x1f,0xe0,0xd8,0x27};
  ```

4. 运行 ```vi off.c```，将 166 行的十六进制数改为解码所得的关机信号，如：
  ```
  char data[6] = {0xb2,0x4d,0x7b,0x84,0xe0,0x1f};
  ```

5. 编译代码生成可执行文件：
  ```
  gcc on.c -lwiringPi -o on.out
  chmod +x on.out
  gcc off.c -lwiringPi -o off.out
  chmod +x off.out
  ```

6. 发射开机信号： ```sudo ./on.out```.

7. 发射关机信号： ```sudo ./off.out```.

### 6) 声卡、麦克风及扬声器

> 树莓派有板载的 3.5mm 音频输出接口但没有输入，所以我用 USB 声卡作为音频输入和输出。

1. USB 声卡接入树莓派并连接麦克风及扬声器。

2. 运行 ```arecord -l``` 及 ```aplay -l``` 确认 ***USB Audio Device*** 编号，比如 *card 1*。

3. 录制 5s 的测试录音：```arecord -Dplughw:[n] -fcd -d5 -c1 -twav -r16000 test.wav``` (将 [n] 替换为 USB 声卡的编号，比如 *Dplughw:1*)。

4. 播放测试录音：```aplay -Dplughw:[n] test.wav``` (将 [n] 替换为 USB 声卡的编号，比如 *Dplughw:1*)。

5. 将 USB 声卡设为默认音频设备，运行```sudo vi /lib/modprobe.d/aliases.conf```，写入以下内容并保存：
  ```
  options snd_usb_audio index=0
  options snd_bcm2835 index=1
  options snd slots=snd_usb_audio,snd_bcm2835
  ```

6. 重启树莓派: ```sudo reboot```。

7. 运行 ```cat /proc/asound/modules``` 确认显示如下：
  ```
  0 snd_usb_audio
  1 snd_bcm2835
  ```

8. 此时播放 .wav 无需指定设备编号即是USB输出： ```aplay test.wav```。

### 7) 摄像头

> 借用 [picam](https://github.com/iizukanao/picam) 生成 [HTTP Live Streaming (HLS)](https://developer.apple.com/streaming/) 直播视频流。

1. 将树莓派摄像头接至树莓派。

2. 运行 ```sudo raspi-config```，选择 ***Interfacing Options***，选择 ***Camera*** > ***Yes***。

3. 安装 picam 的依赖:
  ```
  sudo apt-get update
  sudo apt-get install libharfbuzz0b libfontconfig1
  ```

4. 创建目录和软连接:
  ```
  cd ~;mkdir picam;cd picam
  ```
  ```
  cat > make_dirs.sh <<'EOF'
  #!/bin/bash
  DEST_DIR=~/picam
  SHM_DIR=/run/shm
  mkdir -p $SHM_DIR/rec
  mkdir -p $SHM_DIR/hooks
  mkdir -p $SHM_DIR/state
  mkdir -p $DEST_DIR/archive
  ln -sfn $DEST_DIR/archive $SHM_DIR/rec/archive
  ln -sfn $SHM_DIR/rec $DEST_DIR/rec
  ln -sfn $SHM_DIR/hooks $DEST_DIR/hooks
  ln -sfn $SHM_DIR/state $DEST_DIR/state
  EOF
  ```
  ```
  chmod +x make_dirs.sh
  ./make_dirs.sh
  ```

5. 安装 picam 库:
  ```
  wget https://github.com/iizukanao/picam/releases/download/v1.4.6/picam-1.4.6-binary-jessie.tar.xz
  tar xvf picam-1.4.6-binary-jessie.tar.xz
  cp picam-1.4.6-binary-jessie/picam ~/picam/
  ```

6. 创建 HLS 视频直播流:
  ```
  cd ~/picam
  ./picam -o /run/shm/hls
  ```

7. 配置 Nginx 服务器。运行 ```sudo vi /etc/nginx/sites-available/default```，在 server 的 { ... } 块中添加以下内容:
  ```
  location /hls/ {
    root /run/shm;
  }
  ```

8. 重启 Nginx:
  ```
  sudo /etc/init.d/nginx restart
  ```

9. 测试播放视频流：

 > HLS 地址为 http://[IP-of-Raspberry-Pi]/hls/index.m3u8.

  * 使用 Mac 自带的 QuickTime 播放：

    打开 ***QuickTime***，选择 ***File > Open Location***, 输入 http://[IP-of-Raspberry-Pi]/hls/index.m3u8

  * 或使用网页播放：

    i. 下载测试用的 html 复制至 Nginx 服务器根目录：
    ```
    sudo cp ~/PiBot/PiBotServer/public/hls_test.html /var/www/html/hls_test.html
    ```

    ii. 在树莓派或同一网络中的电脑上，打开浏览器，转到 http://[IP-of-Raspberry-Pi]/hls_test.html

## 配置 Nginx 服务器

> 启用 80 端口的 HTTP 以及 443 端口的 HTTPS。如果不启用 HTTPS，当域名非 localhost 时将无法使用录音功能。参考： https://goo.gl/rStTGz

1. 运行 ```sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/snippets/nginx-selfsigned.key -out /etc/nginx/snippets/nginx-selfsigned.crt``` 创建 HTTPS 用的证书。

2. 将 ***/etc/nginx/sites-enabled/default*** 内的内容替换为 ***~/PiBot/PiBotServer/ngnix/default***。

3. 运行 ```sudo nginx -t``` 测试配置文件。如果没问题，重启 Nginx 服务器：```sudo /etc/init.d/nginx restart```

## 使用网页应用

1. 运行 ```cd ~/PiBot/PiBotServer;npm install``` 安装依赖。

2. 开启 HLS 直播视频流：
  ```
  cd ~/picam
  ./make_dirs.sh
  ./picam -o /run/shm/hls --vflip --hflip
  ```

3. 开启网页应用：
  ```
  cd ~/PiBot/PiBotServer
  sudo npm start
  ```

4. 在浏览器中打开 ```http[s]://[IP-of-Raspberry-Pi]``` (将 [IP-of-Raspberry-Pi] 替换为实际的网址，比如：*192.168.1.16*)

##  使用移动应用

### iOS

* 编译并在模拟器中运行:

  ```
  cd PiBot/PiBotApp
  npm install
  npm run ios
  ```

* 在设备上运行:

  参考 React Native 官方文档的 [Running your app on iOS devices]( https://facebook.github.io/react-native/docs/running-on-device.html#running-your-app-on-ios-devices)。

### Android

* 编译并在模拟器中运行应用:

  ```
  cd PiBot/PiBotApp
  npm install
  npm run android
  ```

* 在设备上运行:

  参考 React Native 官方文档的 [Running your app on Android devices]( https://facebook.github.io/react-native/docs/running-on-device.html#running-your-app-on-android-devices)。

  或者直接使用 PiBot.apk。
