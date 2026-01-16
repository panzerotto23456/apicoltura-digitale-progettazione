// ============================================================================
// SHT21 (HTU21D) - Sensore Temperatura e Umidita Ambientale
// ============================================================================

#include <Wire.h>
#include "Adafruit_HTU21DF.h"
#include "SensorValidation.h"

// ============================================================================
// CONFIGURAZIONE HARDWARE
// ============================================================================
#define I2C_SDA 15
#define I2C_SCL 14

static Adafruit_HTU21DF sht21 = Adafruit_HTU21DF();

// ============================================================================
// VARIABILI INTERNE - UMIDITA
// ============================================================================
static float _sht21_umidita_sogliaMin = 40.0f;
static float _sht21_umidita_sogliaMax = 70.0f;
static unsigned long _sht21_umidita_intervallo = 360000;
static bool _sht21_umidita_abilitato = true;
static int _sht21_umidita_contatore = 0;
static unsigned long _last_read_time_hum = 0;

// ============================================================================
// VARIABILI INTERNE - TEMPERATURA
// ============================================================================
static float _sht21_temp_sogliaMin = 20.0f;
static float _sht21_temp_sogliaMax = 40.0f;
static unsigned long _sht21_temp_intervallo = 360000;
static bool _sht21_temp_abilitato = true;
static int _sht21_temp_contatore = 0;
static unsigned long _last_read_time_temp = 0;

// ============================================================================
// STATO SENSORE
// ============================================================================
static bool _sht21_inizializzato = false;

// ============================================================================
// CONFIG VALIDAZIONE
// ============================================================================
static ConfigValidazioneSensore _configValidazioneUmidita = {
  .rangeMin = 0.0f,
  .rangeMax = 100.0f,
  .permettiNegativi = false,
  .richiedeTimestamp = true,
  .valoreDefault = 50.0f,
  .nomeSensore = "SHT21_HUM"
};

static ConfigValidazioneSensore _configValidazioneTemp = {
  .rangeMin = -40.0f,
  .rangeMax = 125.0f,
  .permettiNegativi = true,
  .richiedeTimestamp = true,
  .valoreDefault = 25.0f,
  .nomeSensore = "SHT21_TEMP"
};

// ============================================================================
// DB READ / WRITE (STUB) - RISERVATO AL GRUPPO DATABASE
// ============================================================================

static void letturaConfigDalDB_sht21_humidity() {
  // STUB: lettura configurazione umidità dal DB
}

static void letturaConfigDalDB_sht21_temperature() {
  // STUB: lettura configurazione temperatura dal DB
}

static void scritturaDatoNelDB_sht21_humidity(const RisultatoValidazione* risultato) {
  // STUB: scrittura umidità nel DB
  (void)risultato;
}

static void scritturaDatoNelDB_sht21_temperature(const RisultatoValidazione* risultato) {
  // STUB: scrittura temperatura nel DB
  (void)risultato;
}

// ============================================================================
// SETUP
// ============================================================================
void setup_sht21() {
  Serial.println("-> Inizializzazione sensore SHT21...");
  Wire.begin(I2C_SDA, I2C_SCL);
  Wire.setPins(15, 14);

  if (!sht21.begin()) {
    Serial.println("  ! ERRORE: Sensore SHT21 non trovato!");
    _sht21_inizializzato = false;
  } else {
    _sht21_inizializzato = true;
    Serial.println("  + Sensore SHT21 inizializzato");
  }

  Serial.println("  + Setup SHT21 completato\n");
}

// ============================================================================
// INIT UMIDITA
// ============================================================================
void init_humidity_sht21(SensorConfig* config) {
  if (config == NULL) return;

  _sht21_umidita_sogliaMin = config->sogliaMin;
  _sht21_umidita_sogliaMax = config->sogliaMax;
  _sht21_umidita_intervallo = config->intervallo;
  _sht21_umidita_abilitato = config->abilitato;
  _sht21_umidita_contatore = 0;
<<<<<<< HEAD

  Serial.println("  --- Config SHT21 Umidita caricata dal DB ---");
  Serial.print("    Soglia MIN: "); Serial.print(_sht21_umidita_sogliaMin); Serial.println(" %");
  Serial.print("    Soglia MAX: "); Serial.print(_sht21_umidita_sogliaMax); Serial.println(" %");
  Serial.print("    Intervallo: "); Serial.print(_sht21_umidita_intervallo / 1000.0); Serial.println(" sec");
  Serial.print("    Abilitato: "); Serial.println(_sht21_umidita_abilitato ? "SI" : "NO");
=======
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
}

// ============================================================================
// INIT TEMPERATURA
// ============================================================================
void init_temperature_sht21(SensorConfig* config) {
  if (config == NULL) return;

  _sht21_temp_sogliaMin = config->sogliaMin;
  _sht21_temp_sogliaMax = config->sogliaMax;
  _sht21_temp_intervallo = config->intervallo;
  _sht21_temp_abilitato = config->abilitato;
  _sht21_temp_contatore = 0;
<<<<<<< HEAD

  Serial.println("  --- Config SHT21 Temperatura caricata dal DB ---");
  Serial.print("    Soglia MIN: "); Serial.print(_sht21_temp_sogliaMin); Serial.println(" C");
  Serial.print("    Soglia MAX: "); Serial.print(_sht21_temp_sogliaMax); Serial.println(" C");
  Serial.print("    Intervallo: "); Serial.print(_sht21_temp_intervallo / 1000.0); Serial.println(" sec");
  Serial.print("    Abilitato: "); Serial.println(_sht21_temp_abilitato ? "SI" : "NO");
=======
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
}

// ============================================================================
// READ HUMIDITY
// ============================================================================
RisultatoValidazione read_humidity_sht21() {
<<<<<<< HEAD
  RisultatoValidazione risultato; // Dichiariamo subito per usarla nei ritorni anticipati

  // 1. CHECK ABILITATO
  if (!_sht21_umidita_abilitato) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_SENSOR_OFFLINE;
    risultato.valorePulito = _configValidazioneUmidita.valoreDefault;
    strcpy(risultato.messaggioErrore, "[SHT21_HUM] Sensore disabilitato");
    return risultato;
  }

  // 2. CHECK INIZIALIZZAZIONE
  if (!_sht21_inizializzato) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_SENSOR_NOT_READY;
    risultato.valorePulito = _configValidazioneUmidita.valoreDefault;
    strcpy(risultato.messaggioErrore, "[SHT21_HUM] Sensore non inizializzato");
    return risultato;
=======
  if (!_sht21_umidita_abilitato || !_sht21_inizializzato) {
    RisultatoValidazione r;
    r.valido = false;
    r.codiceErrore = ERR_SENSOR_NOT_READY;
    r.valorePulito = _configValidazioneUmidita.valoreDefault;
    strcpy(r.messaggioErrore, "[SHT21_HUM] Sensore non pronto");
    return r;
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
  }

  // 3. CHECK INTERVALLO (PUNTO 3)
  // Se non è passato abbastanza tempo dall'ultima lettura, usciamo subito.
  if (millis() - _last_read_time_hum < _sht21_umidita_intervallo) {
    risultato.valido = false; 
    // Usiamo un codice generico o 0 per indicare "Nessuna nuova lettura necessaria"
    risultato.codiceErrore = 0; 
    risultato.valorePulito = _configValidazioneUmidita.valoreDefault; 
    // Messaggio vuoto o di debug, così il DB non scrive nulla se valido=false
    strcpy(risultato.messaggioErrore, "Intervallo non trascorso"); 
    return risultato;
  }

  // Aggiorniamo il tempo dell'ultima lettura
  _last_read_time_hum = millis();

  // 4. LETTURA E VALIDAZIONE
  float umidita = sht21.readHumidity();
<<<<<<< HEAD

  // (PUNTO 4): Rimosso il controllo "!= 998" (Magic Number)
  bool sensoreReady = !isnan(umidita); 
  unsigned long timestamp = millis();

  risultato = validaDatoSensore(
    umidita,
    timestamp,
    sensoreReady,
    _configValidazioneUmidita
=======
  bool sensoreReady = !isnan(umidita) && umidita != 998;
  unsigned long timestamp = millis();

  RisultatoValidazione risultato = validaDatoSensore(
    umidita, timestamp, sensoreReady, _configValidazioneUmidita
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
  );

  if (risultato.valido) {
    verificaSoglie(risultato.valorePulito,
                   _sht21_umidita_sogliaMin,
                   _sht21_umidita_sogliaMax,
                   "SHT21_HUM");
    _sht21_umidita_contatore++;
    scritturaDatoNelDB_sht21_humidity(&risultato);
  }

  return risultato;
}

// ============================================================================
// READ TEMPERATURE
// ============================================================================
RisultatoValidazione read_temperature_sht21() {
<<<<<<< HEAD
  RisultatoValidazione risultato;

  // 1. CHECK ABILITATO
  if (!_sht21_temp_abilitato) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_SENSOR_OFFLINE;
    risultato.valorePulito = _configValidazioneTemp.valoreDefault;
    strcpy(risultato.messaggioErrore, "[SHT21_TEMP] Sensore disabilitato");
    return risultato;
  }

  // 2. CHECK INIZIALIZZAZIONE
  if (!_sht21_inizializzato) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_SENSOR_NOT_READY;
    risultato.valorePulito = _configValidazioneTemp.valoreDefault;
    strcpy(risultato.messaggioErrore, "[SHT21_TEMP] Sensore non inizializzato");
    return risultato;
=======
  if (!_sht21_temp_abilitato || !_sht21_inizializzato) {
    RisultatoValidazione r;
    r.valido = false;
    r.codiceErrore = ERR_SENSOR_NOT_READY;
    r.valorePulito = _configValidazioneTemp.valoreDefault;
    strcpy(r.messaggioErrore, "[SHT21_TEMP] Sensore non pronto");
    return r;
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
  }

  // 3. CHECK INTERVALLO (PUNTO 3)
  if (millis() - _last_read_time_temp < _sht21_temp_intervallo) {
    risultato.valido = false;
    risultato.codiceErrore = 0; 
    risultato.valorePulito = _configValidazioneTemp.valoreDefault;
    strcpy(risultato.messaggioErrore, "Intervallo non trascorso");
    return risultato;
  }

  _last_read_time_temp = millis();

  // 4. LETTURA E VALIDAZIONE
  float temperatura = sht21.readTemperature();
<<<<<<< HEAD

  // (PUNTO 4): Semplificato
  bool sensoreReady = !isnan(temperatura);
  unsigned long timestamp = millis();

  risultato = validaDatoSensore(
    temperatura,
    timestamp,
    sensoreReady,
    _configValidazioneTemp
=======
  bool sensoreReady = !isnan(temperatura);
  unsigned long timestamp = millis();

  RisultatoValidazione risultato = validaDatoSensore(
    temperatura, timestamp, sensoreReady, _configValidazioneTemp
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
  );

  if (risultato.valido) {
    verificaSoglie(risultato.valorePulito,
                   _sht21_temp_sogliaMin,
                   _sht21_temp_sogliaMax,
                   "SHT21_TEMP");
    _sht21_temp_contatore++;
    scritturaDatoNelDB_sht21_temperature(&risultato);
  }

  return risultato;
}
<<<<<<< HEAD
// ============================================================================
// GETTERS - Accesso ai parametri di configurazione
// ============================================================================
unsigned long get_intervallo_humidity_sht21() {
  return _sht21_umidita_intervallo;
}

unsigned long get_intervallo_temperature_sht21() {
  return _sht21_temp_intervallo;
}

bool is_abilitato_humidity_sht21() {
  return _sht21_umidita_abilitato;
}

bool is_abilitato_temperature_sht21() {
  return _sht21_temp_abilitato;
}

bool is_inizializzato_sht21() {
  return _sht21_inizializzato;
}
=======
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
