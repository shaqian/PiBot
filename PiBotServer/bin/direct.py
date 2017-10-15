#!/usr/bin/python3
import sys, time
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(19, GPIO.OUT)
pwm=GPIO.PWM(19,50)
pwm.start(float(sys.argv[1]))
time.sleep(1)
