#!/usr/bin/python3
from hcsr04sensor import sensor
from time import sleep
import requests

def main():
    while(1):
        trig_pin = 17
        echo_pin = 27
        value = sensor.Measurement(trig_pin, echo_pin)
        raw_measurement = value.raw_distance()
        metric_distance = value.distance_metric(raw_measurement)
        print("The Distance = {} centimeters".format(metric_distance))
        if(metric_distance < 20):
            try:
                r = requests.get('http://localhost:3000/stop', verify=False)
                print(r.content)
            except:
                pass

if __name__ == "__main__":
    main()
