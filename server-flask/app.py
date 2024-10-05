from flask import Flask, request
from temperature_sensor import get_temp

app = Flask(__name__)

@app.route('/post', methods = ["POST"])

def post():

	#Data is posted via json
	data = request.get_json()
	soil_moisture = data.get('soil-moisture', 'No data')
	lux = data.get('lux', 'No data')

	#Data received from local sensor
	temp = get_temp()

	print(f"soil-moisture: {soil_moisture}")
	print(f"lux: {lux}")
	print(f"temp: {temp}")

	return ""

app.run(debug=True, host='0.0.0.0', port = 4000)
	
