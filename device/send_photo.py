# Posts a photo to
import requests

hostname_local = 'http://localhost:3000'
hostname_cloud = 'http://104.131.159.237:3000'
call_string = hostname_cloud + '/api/photos/'

# FIXME: add your path to the photo (device specific) here
image_path = '/Users/joleary/Desktop/image.jpg'
files = { 'devicePicture': open(image_path, 'rb') }

res = requests.post(call_string, files=files)
print res
