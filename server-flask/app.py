from flask import Flask, request
import json


app = Flask(__name__)

@app.route('/post', methods = ["POST"])


#def read_temp_raw():


#!!! Call read_temp() in post()
#def read_temp():

def post():

	#Data is posted via json
	with open('data.json', 'r') as file:
		data = json.load(file)
	print("soil-moisture:" + data['soil-moisture'])
	print("lux:" + data['lux']) 
	print("temperature: goes here!")

	file.close()
	return ""

app.run(debug=True, host='0.0.0.0', port = 4000)
	
