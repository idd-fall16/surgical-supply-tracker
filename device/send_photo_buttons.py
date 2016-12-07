from picamera import PiCamera
from time import sleep
from gpiozero import Button
import requests
import sys
from Tkinter import *

#PiCam Setup
camera = PiCamera()
image_path = '/home/pi/Desktop/image.jpg'
camera.start_preview(fullscreen=False, window = (100, 20, 160, 120))

#Capture Image
def capture_image():
    sleep(2)
    camera.capture(image_path)

    #send photo
    hostname_local = 'http://localhost:3000'
    hostname_cloud = 'http://surgitrack.tech'
    case_number = '1'
    call_string_local = hostname_local + '/api/cases/' + case_number + '/items/photo'
    call_string_cloud = hostname_cloud + '/api/cases/' + case_number + '/items/photo'
    files = { 'devicePicture': open(image_path, 'rb') }

    res_local = requests.post(call_string_local, files=files)
    res_cloud = requests.post(call_string_cloud, files=files)
    print res_local, res_cloud

#Close Camera
def close_camera():
    sys.exit()

#Camera Buttons
win = Tk()
f = Frame(win)
b1 = Button(f, text="Capture Image")
b2 = Button(f,text="Stop Camera")
b1.pack(side=LEFT, padx =5)
b2.pack(side=LEFT, padx =5)
l = Label(win, text="Image Text on Item Package")
l.pack(side=TOP)
f.pack()

#Button Commands
b1.configure(command=capture_image)
b2.configure(command=close_camera)

mainloop()
