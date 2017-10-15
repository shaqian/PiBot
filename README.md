# PiBot

Raspberry Pi robot with iOS, Android app and web UI.

## Demo

![Raspberry Pi](/images/pibotapp.gif)

## UI

![Raspberry Pi](/images/pibotapp.png)

![Raspberry Pi](/images/pibotweb.png)

## Assembly

![Raspberry Pi](/images/assembly.gif)

## Parts list

* **Raspberry Pi v3 Model B**

* **Camera**: 8MP Raspberry Pi Camera v2

* **Micro SD Card**

  8G or above.

* **USB Sound Card**

  I'm using [this](https://detail.tmall.com/item.htm?id=43007935397).

* **Microphone**

  3.5mm jack, I'm using [this](https://detail.tmall.com/item.htm?id=21808596718).

* **Speaker**

  Mini speaker with 3.5mm jack.

* **Robot Car Kit:** ZK-4WD

  ![Robot Car Kit](/images/parts/car.jpg)

* **Motor driver**: L298n

* **5v Power Supply**

  Powers the Raspberry Pi.

* **Battery Power Supply**

  Two 18650 (3.7v) batteries with battery case. Powers the motor driver.

* **DC-DC Converter**: LM2596S

  Converts 7.4v to 5v to power the servo.

* **Servo**: SG90 9g

* **Servo Mount**

  I'm using [this](https://item.taobao.com/item.htm?id=531675916868) (keyword: 2 Axis Servo Gimbal FPV Camera Platform), but with only 1 servo because there're only two unique channels of hardware PWM output and I need to reserve one for IR.

* **IR Transmitter**

  I originally used the IR module for Arduino: KY-005, but the range was short.

  Then I found [this](https://item.taobao.com/item.htm?id=38698599143) (keyword: 1/3W High Power
IR Transmitter Module For Arduino) that can get several meters.

* **IR Receiver**: KY-022 (IR Receiver for Arduino)

* **Bread Board**: SYB-170

* **DuPont Line**

  20 or 30cm male to female.

* **Resistors**

  1/4W 1kΩ & 2kΩ.

## Circuit Diagram

### Motor Driver and Motors

The "9v" battery is actually two 3.7v 18650 batteries.

![Motor Schematic](/images/motor_schem.png)

![Motor BreadBoard](/images/motor_bb.png)

### Servo

The "9v" battery is actually two 3.7v 18650 batteries.

![Servo Schematic](/images/servo_schem.png)

![Servo BreadBoard](/images/servo_bb.png)

### Temperature and Humidity Sensor

![Temperature and Humidity Sensor Schematic](/images/temp_hum_schem.png)

![Temperature and Humidity Sensor BreadBoard](/images/temp_hum_bb.png)

### IR Receiver

![IR Receiver Schematic](/images/ir_receiver_schem.png)

![IR Receiver BreadBoard](/images/ir_receiver_bb.png)

### IR Transmitter

![IR Transmitter Schematic](/images/ir_sender_schem.png)

![IR Transmitter BreadBoard](/images/ir_sender_bb.png)

## Set Up Raspberry Pi and Network Connection

### 1） Install OS (with a Mac)

* (Optional) Format SD card

  1. Install [SD Card Formatter](https://www.sdcard.org/downloads/formatter_4/).

  2. Open ***SD Card Formatter*** and choose ***Overwrite Format***.

  3. Click ***Format***.

* Install Raspbian from image ([Official doc](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md))

  1. Download .zip file for [RASPBIAN STRETCH WITH DESKTOP](https://www.raspberrypi.org/downloads/raspbian/).

  2. Unzip the file to extract the image, ie: *2017-07-05-raspbian-jessie.img*.

  3. Open a terminal and run ```diskutil list```. You will see a list of all your disks.

  4. Connect the SD card reader with the SD card inside.

  5. Run ```diskutil list``` again, identify the disk (not the partition) of your SD card, e.g. *disk3*, not *disk3s1*.

  6. Unmount your SD card by using the disk identifier: ```sudo diskutil unmountDisk /dev/disk[n]``` (replacing [n] with the number of the disk, ie: */dev/disk3*).

  7. Copy the image to your SD card: ```sudo dd bs=1m if=[path-to-the-image-file] of=/dev/rdisk[n] conv=sync``` (replacing [path-to-the-image-file] ie: *~/Downloads/2017-07-05-raspbian-jessie.img*, and replacing [n] with the number of the disk, ie: */dev/rdisk3*).


### 2) SSH to Raspberry Pi ([Official doc](https://www.raspberrypi.org/documentation/remote-access/ssh/))

 1. Enable SSH:

    For Raspbian released after the end of Nov 2016, SSH is disabled by default. It can be enabled by placing a file named ***ssh***, without any extension, onto the boot partition of the SD card.

 2. Eject your SD card and insert it into the Raspberry Pi.

 3. Connect the Raspberry Pi to your home router with a ethernet cable, then power it using a micro USB charger.

 4. Determine the IP address of the Raspberry Pi. If you do not have access to the router, open a terminal and run ```sudo nmap -sP -PI -PT 192.168.1.0/24``` to scan all the devices in your home network.

 5. Open a terminal, run ```ssh pi@[IP-of-Raspberry-Pi]``` (replacing [IP-of-Raspberry-Pi] with actual IP address, ie: *192.168.1.16*), enter default password ***raspberry***.

 6. (Optional) Change password: ```passwd pi```.

### 3) (Optional) Configure Graphical Remote Desktop ([Official doc](https://www.raspberrypi.org/documentation/remote-access/vnc/))

1. If VNC connect is not yet installed on your Raspberry Pi, run

  ```
  sudo apt-get update
  sudo apt-get install realvnc-vnc-server realvnc-vnc-viewer
  ```

2. To enable VNC Server, run ```sudo raspi-config```, navigate to ***Interfacing Options***, scroll down and select ***VNC*** > ***Yes***.

3. Open [VNC Viewer](https://www.realvnc.com/en/connect/download/viewer/), enter your Raspberry Pi's IP address to connect.

### 4) Connect to Wifi ([Official doc](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md))

1. Run ```cat /etc/network/interfaces```. Make sure you have:
  ```
  iface wlan0 inet manual
      wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
  ```

2. Run ```sudo vi /etc/wpa_supplicant/wpa_supplicant.conf```. Go to the bottom of the file and add the following:
  ```
  network={
      ssid="{Name-of-the-Wifi}"
      psk="{Password-of-the-Wifi}"
  }
  ```

3. Run ```sudo service networking restart``` to take effect. Now you can unplug the ethernet cable and use wifi only.

## Install Prerequisites

### 1) Python 3.x

If ```which python3``` returns nothing, run ```sudo apt-get install python3```.

### 2) NodeJs 8.x

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install nodejs
node -v
```

### 3) Nginx Server

Install the nginx package ```sudo apt-get install nginx``` and start the server ```sudo /etc/init.d/nginx start```.

### 4) Audio & Video related

Install the library for ALSA applications development files: ```sudo apt-get install libasound2-dev```. If you got 404 Not Found, run ```sudo apt-get upgrade --fix-missing```.

*avconv* is needed for converting recorded videos to .mp4 format: ```sudo apt-get install libav-tools```

*mpg123* is used for playing .mp3 format music: ```sudo apt-get install mpg123```

### 5) Clone the repo

```
cd ~
git clone https://github.com/shaqian/PiBot.git
```

## Set up and Test Hardware Components

### 1) Motor driver and motors

> Do not install the wheels when testing.

1. Refer to [the circuit diagram](#motor-driver-and-motors) and connect the wires.

2. Install [rpio](https://github.com/jperkin/node-rpio), run ```npm install rpio```.

3. Start node, run ```node```.

3. Initialize output:
  ```
  var rpio = require('rpio');
  rpio.open(29, rpio.OUTPUT, rpio.LOW);
  rpio.open(31, rpio.OUTPUT, rpio.LOW);
  rpio.open(38, rpio.OUTPUT, rpio.LOW);
  rpio.open(40, rpio.OUTPUT, rpio.LOW);
  ```

4. Go forward:
  ```
  rpio.write(29, rpio.LOW);
  rpio.write(31, rpio.HIGH);
  rpio.write(38, rpio.LOW);
  rpio.write(40, rpio.HIGH);
  ```

5. Go backward:
  ```
  rpio.write(29, rpio.HIGH);
  rpio.write(31, rpio.LOW);
  rpio.write(38, rpio.HIGH);
  rpio.write(40, rpio.LOW);
  ```

6. Stop:
  ```
  rpio.write(29, rpio.LOW);
  rpio.write(31, rpio.LOW);
  rpio.write(38, rpio.LOW);
  rpio.write(40, rpio.LOW);
  ```

### 2) Servo

1. Refer to [the circuit diagram](#servo) and connect the wires.

2. Run:
  ```
  cd ~/PiBot/PiBotServer/bin
  chmod +x direct.py
  ```

3. The position is controlled by duty cycle, normally ranges from 2.5 to 11.5. Go to middle position:
  ```
  ./direct.py 7
  ```

4. Full left:
  ```
  ./direct.py 2.5
  ```

5. Full right:
  ```
  ./direct.py 11.5
  ```

### 3) Temperature and Humidity Sensor

1. Refer to [the circuit diagram](#temperature-and-humidity-sensor) and connect the wires.

2. Run:
  ```
  cd ~/PiBot/PiBotServer/bin/temp_hum
  chmod +x getTemp.py
  chmod +x getHum.py
  ```

3. Get temperature:
  ```
  ./getTemp.py
  ```

4. Get humidity:
  ```
  ./getHum.py
  ```

### 4) IR Receiver

> I use IR Receiver to read IR signal from remote controls of home appliances, then emulate the remote control by sending the same signal from Raspberry P.

> I borrowed the code from [this repo](https://github.com/tanhangbo/RaspberryIR) but changed the ports as well as the value of ST_BASE which was 0x20003000 for older Raspberry Pi but should be 0x3F003000 for Raspberry Pi 3 (BCM2837).

1. Refer to [the circuit diagram](#ir-receiver) and connect the wires.

2. Run ```gpio -v``` to check if wiringPi is already installed. If not, install [Wiring Pi](http://wiringpi.com/download-and-install/).

3. Run ```cd ~/PiBot/PiBotServer/bin```. Compile the code and generate the binary:
  ```
  gcc ir_decode.c -lwiringPi -o decode.out
  chmod +x decode.out
  ```

4. Run ```sudo ./decode.out```. It would print *[0]* every one second when no IR signal is received.

5. Point the remote control to the IR receiver and press the button. The decoded IR signal is a series of hex numbers, ie: *0xb2,0x4d,0x1f,0xe0,0x98,0x67,[48]*.

6. Repeat the same for "ON" button and "OFF" button, and note down the IR signals.

### 5) IR Transmitter

> Disconnect the IR Receiver as we are done with IR decoding.

1. Refer to [the circuit diagram](#ir-transmitter) and connect the wires.

2. Run the following to duplicate the ir_encode code.
  ```
  cd ~/PiBot/PiBotServer/bin
  cp ir_encode.c on.c
  cp ir_encode.c off.c
  ```

3. Run ```vi on.c```, and change the hex string in line 166 to what you have decoded, ie:
  ```
  char data[6] = {0xb2,0x4d,0x1f,0xe0,0xd8,0x27};
  ```

4. Run ```vi off.c```, and change the hex string in line 166 to what you have decoded, ie:
  ```
  char data[6] = {0xb2,0x4d,0x7b,0x84,0xe0,0x1f};
  ```

5. Compile the code and generate the binary:
  ```
  gcc on.c -lwiringPi -o on.out
  chmod +x on.out
  gcc off.c -lwiringPi -o off.out
  chmod +x off.out
  ```

6. Send "ON" signal: ```sudo ./on.out```.

7. Send "OFF" signal: ```sudo ./off.out```.

### 6) Sound Card, Microphone and Speaker

> Raspberry Pi has a built-in 3.5mm jack for audio output but no input. I use a USB sound card for both speaker output and microphone input.

1. Plug the USB sound card in. Connect the microphone and speaker to the sound card.

2. Run ```arecord -l``` and ```aplay -l``` and identify card number of your ***USB Audio Device***, e.g. *card 1*.

3. Record a 5 seconds test audio: ```arecord -Dplughw:[n] -fcd -d5 -c1 -twav -r16000 test.wav``` (replacing [n] with the number of USB Audio Device, e.g. *Dplughw:1*).

4. Play the test audio: ```aplay -Dplughw:[n] test.wav``` (replacing [n] with the number of USB Audio Device, e.g. *Dplughw:1*).

5. To set the USB sound card to be the default audio device, run ```sudo vi /lib/modprobe.d/aliases.conf```, insert the following and save:
  ```
  options snd_usb_audio index=0
  options snd_bcm2835 index=1
  options snd slots=snd_usb_audio,snd_bcm2835
  ```

6. Reboot: ```sudo reboot```.

7. Run ```cat /proc/asound/modules``` and you should have:
  ```
  0 snd_usb_audio
  1 snd_bcm2835
  ```

8. Play the .wav again without specifying device: ```aplay test.wav```.

### 7) Camera

> I use [picam](https://github.com/iizukanao/picam) to generate [HTTP Live Streaming (HLS)](https://developer.apple.com/streaming/).

1. Connect Raspberry Pi Camera Board to the Raspberry Pi.

2. Run ```sudo raspi-config```, navigate to ***Interfacing Options*** and select ***Camera*** > ***Yes***.

3. Install dependencies for picam:
  ```
  sudo apt-get update
  sudo apt-get install libharfbuzz0b libfontconfig1
  ```

4. Create directories and symbolic links:
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

5. Install picam library:
  ```
  wget https://github.com/iizukanao/picam/releases/download/v1.4.6/picam-1.4.6-binary-jessie.tar.xz
  tar xvf picam-1.4.6-binary-jessie.tar.xz
  cp picam-1.4.6-binary-jessie/picam ~/picam/
  ```

6. Start HTTP Live Streaming:
  ```
  cd ~/picam
  ./picam -o /run/shm/hls
  ```

7. Configure Nginx server. Run ```sudo vi /etc/nginx/sites-available/default``` and add the following inside server { ... } bloc:
  ```
  location /hls/ {
    root /run/shm;
  }
  ```

8. Restart Nginx:
  ```
  sudo /etc/init.d/nginx restart
  ```

9. Test playback:

 > The HLS will be available at http://[IP-of-Raspberry-Pi]/hls/index.m3u8.

  * With QuickTime on a Mac:

    Open ***QuickTime*** player, go to ***File > Open Location***, enter http://[IP-of-Raspberry-Pi]/hls/index.m3u8.

  * Or playback in a web browser:

    i. Download the test file and copy it to Nginx root.
    ```
    sudo cp ~/PiBot/PiBotServer/public/hls_test.html /var/www/html/hls_test.html
    ```

    ii. From the Raspberry Pi or any PC that in the same network, navigate to http://[IP-of-Raspberry-Pi]/hls_test.html in a web browser.

## Configure Nginx

> Enable both HTTP on port 80 and HTTPS on port 443. HTTPS is required to get recording working in Chrome when requests are not originated from local host. See: https://goo.gl/rStTGz

1. Run ```sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/snippets/nginx-selfsigned.key -out /etc/nginx/snippets/nginx-selfsigned.crt``` to create the certificates used for HTTPS in nginx.

2. Replace the content in ***/etc/nginx/sites-enabled/default*** with ***~/Cognitive-Bot/ngnix/default***.

3. Run ```sudo nginx -t``` to test the configurations. If successful, restart nginx server ```sudo /etc/init.d/nginx restart```.

## Run the Web Application

1. Run ```cd ~/PiBot/PiBotServer;npm install``` to install all dependencies.

2. Start HLS video streaming:
  ```
  cd ~/picam
  ./make_dirs.sh
  ./picam -o /run/shm/hls --vflip --hflip
  ```

3. To start the application, run:
  ```
  cd ~/PiBot/PiBotServer
  sudo npm start
  ```

4. Navigate to ```http[s]://[IP-of-Raspberry-Pi]``` in a web browser (replacing IP-of-Raspberry-Pi with the actual IP address, ie: *192.168.1.16*).

##  Run the Mobile App

### iOS

* Build and run in simulator:

  ```
  cd PiBot/PiBotApp
  npm install
  npm run ios
  ```

* Run on device:

  Refer to [Running your app on iOS devices]( https://facebook.github.io/react-native/docs/running-on-device.html#running-your-app-on-ios-devices) in React Native official guide.

### Android

* Build and run in simulator:

  ```
  cd PiBot/PiBotApp
  npm install
  npm run android
  ```

* Run on device:

  Refer to [Running your app on Android devices]( https://facebook.github.io/react-native/docs/running-on-device.html#running-your-app-on-android-devices) in React Native official guide.

  Or use the PiBot.apk in this repo.
