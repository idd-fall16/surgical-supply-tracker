
import requests
hostname = 'http://localhost:3000'
call_string = hostname + '/api/photos/'

with open("/Users/isabelyang/Desktop/img.png", "rb") as f:
   data = f.read()
    #print data.encode("base64")

# text = open("test.txt","w") #opens file with name of "test.txt"
# text.write(data.encode("base64"))
# text.close()

string_to_send = data.encode("base64")

res = requests.post(call_string, data=string_to_send)
print res