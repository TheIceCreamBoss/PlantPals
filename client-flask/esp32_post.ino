#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "plantpod";
const char* password = "sxon2147";

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to Wifi...");
  }

  Serial.println("Connected to Wifi Network!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://192.168.232.40:4000/post");
    http.addHeader("Content-Type", "text/plain");
    int httpResponseCode = http.POST("erik lin sucks!!");
    if (httpResponseCode>0) {
      Serial.println(httpResponseCode);
    } else {
      Serial.println("Error sending POST");
    }
    http.end();
  } else {
    Serial.println("Error in WiFi connection");
  }
  delay(1000);
}
