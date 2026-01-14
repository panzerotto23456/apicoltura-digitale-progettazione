# CODICE FUNZIONANTE SENSORE SHT21

Sottostante si può trovare il codice funzionante riguardo il sensore sht21 che calcola umidità e temperatura e inserisce i valori su due variabili float

Libreria Utilizzata: Adafruit HTU21D

## Codice

```cpp
#include <Wire.h>
#include "Adafruit_HTU21DF.h"

Adafruit_HTU21DF sht21 = Adafruit_HTU21DF();

// Pin per ESP32-CAM
#define I2C_SDA 15
#define I2C_SCL 14

// Dichiaro le variabili qui in alto (Globali)
// Così puoi leggerle da qualsiasi punto del programma (es. se aggiungerai il WiFi dopo)
float temperatura = 0.0;
float umidita = 0.0;

void setup() {
  Wire.begin(I2C_SDA, I2C_SCL);
  sht21.begin();
}

void loop() {
  temperatura = sht21.readTemperature();
  umidita = sht21.readHumidity();
  delay(2000);
}
```
| Pin SHT21 | Pin ESP32-CAM | Descrizione |
| :--- | :--- | :---: |
| VIN | 3V3 | Alimentazione |
| GND | GND | Massa |
| SCL | IO14 | Clock |
| SDA | IO15 | Dati |