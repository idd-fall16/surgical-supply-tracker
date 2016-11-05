# Posts a photo to 
import requests

hostname = 'http://localhost:3000'
call_string = hostname + '/api/photos/'
image_path = '/Users/joleary/Desktop/image.jpg'
files = { 'devicePicture': open(image_path, 'rb') }

res = requests.post(call_string, files=files)
print res
