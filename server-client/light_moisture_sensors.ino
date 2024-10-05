#define soil_moisture_pin 34
#include <Adafruit_VEML7700.h>
Adafruit_VEML7700 veml = Adafruit_VEML7700();

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  if (veml.begin()) {
    Serial.println("it is working");
  } else {
    Serial.println("not working");
  };
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.print("Soil moisture: "); Serial.println(analogRead(soil_moisture_pin));
  Serial.print("Lux: "); Serial.println(veml.readLux());
  delay(500);
}
