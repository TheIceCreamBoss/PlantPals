from flask import Flask, request, make_response, jsonify
from temperature_sensor import get_temp

app = Flask(__name__)
soil_moisture = None
lux = None
temp = None


@app.route('/post', methods = ["POST"])

def post():

	global soil_moisture, lux, temp
	#Data is posted via json
	data = request.get_json()
	soil_moisture = data.get('soil-moisture', 'No data')
	lux = data.get('lux', 'No data')
	temp = data.get('temperature', 'No data')

	#Data received from local sensor !!! BROKEN
	#temp = get_temp()

	#DEBUG PRINT
	print(f"soil-moisture: {soil_moisture}")
	print(f"lux: {lux}")
	print(f"temp: {temp}")
	#DEBUG PRINT

	return ""

@app.route('/get', methods = ["GET"])
def get():

	data = {
		'soil_moisture' : soil_moisture,
		'temperature' : temp,
		'lux' : lux
	}
	
	return jsonify(data)

app.run(debug=True, host='0.0.0.0', port = 4000)
	
