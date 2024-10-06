#include <WiFi.h>               // network: wifi
#include <HTTPClient.h>         // network: post
#include <Adafruit_VEML7700.h>  // light sensor
#include <ArduinoJson.h>        // JSON serializer
#define soil_moisture_pin 34    // moisture sensor
Adafruit_VEML7700 veml = Adafruit_VEML7700(); // declare light sensor
// connecting to a wifi network (must be same as pi's)
const char* ssid = "plantpod";
const char* password = "sxon2147";

void setup() {
  // serial port initialization
  Serial.begin(115200);

  // wifi initialization
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to Wifi...");
  }
  Serial.println("Connected to Wifi Network!");

  // light sensor status check
  if (veml.begin()) {
    Serial.println("Light sensor is working");
  } else {
    Serial.println("Light sensor is not working");
  };
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // serialize JSON object
    JsonDocument doc;
    String message;
    doc["soil-moisture"] = analogRead(soil_moisture_pin);
    doc["lux"] = veml.readLux();
    serializeJsonPretty(doc, message);

    HTTPClient http;
    http.begin("http://192.168.232.40:4000/post");
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(message);

    if (httpResponseCode>0) {
      Serial.println(httpResponseCode);
    } else {
      Serial.println("Error sending POST");
    }
    http.end();
  } else {
    Serial.println("Error in WiFi connection");
  }
  delay(3000); // every 5 seconds
}