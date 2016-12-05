from picamera import PiCamera
from time import sleep
from gpiozero import Button
import requests

button = Button(17)
button2 = Button(18)
camera = PiCamera()
image_path = '/home/pi/Desktop/image.jpg'

#photo capture
camera.start_preview(fullscreen=False, window = (100, 20, 640, 480))

def capture_image():
    sleep(2)
    camera.capture(image_path)

    #send photo
    hostname_local = 'http://localhost:3000'
    hostname_cloud = 'http://surgitrack.tech'
    case_number = '1'
    call_string = hostname_cloud + '/api/cases/' + case_number + '/items/photo'
    files = { 'devicePicture': open(image_path, 'rb') }

    res = requests.post(call_string, files=files)
    print res

def close_camera():
    camera.stop_preview()

button.when_pressed = capture_image
button2.when_pressed = close_camera
