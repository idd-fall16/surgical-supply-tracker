# Posts a photo to
import requests

hostname_local = 'http://localhost:3000'
hostname_cloud = 'http://surgitrack.tech'
case_number = '42'
call_string = hostname_cloud + '/api/cases/' + case_number + '/items/photos'

# FIXME: add your path to the photo (device specific) here
image_path = '/Users/joleary/Desktop/devicePicture.jpg'
files = { 'devicePicture': open(image_path, 'rb') }

res = requests.post(call_string, files=files)
print res
