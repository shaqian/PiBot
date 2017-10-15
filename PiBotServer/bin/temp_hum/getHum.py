#!/usr/bin/python3
import RPi.GPIO as GPIO
from DHT11 import dht11
import time
import datetime

# initialize GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.cleanup()

# read data using pin 4
instance = dht11.DHT11(pin=4)
result = instance.read()
if result.is_valid():
    print(result.humidity)

