
// NeoPixel Ring  RainbowSpin (c) 2016 Jonathan Lurie
// released under the GPLv3 license to match the rest of the AdaFruit NeoPixel library.
// Board used: Arduino Nano Chinese clone with Tools > Procesor: ATMega 328P (old bootloader)

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

// Which pin on the Arduino is connected to the NeoPixels?
#define PIN            7

// How many NeoPixels in the ring?
#define NUMPIXELS      24

// instanciation of the main Neopixel object
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

// will receive the color array from the serial
uint8_t allColors[NUMPIXELS * 3];

// a counter of milliseconds to Serial.println("ready") every second
long milliCounterReady = 0;
long milliCounterReadyInterval = 1000;

int increment = 0;

void updateColor() {
  for(int i=0; i<NUMPIXELS; i += 1){

    // Neo works on BGR but we still want to receive the data as RGB from serial port.
    // UPDATE: apparently the Arduino Pro Micro (Sparkfun) works ok with RGB order
    pixels.setPixelColor(i, allColors[i * 3 + 0], allColors[i * 3 + 1], allColors[i * 3 + 2]);

    // update it
    pixels.show();
  }
}


// some init
void setup() {
  // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
#if defined (__AVR_ATtiny85__)
  if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
#endif
  // End of trinket special code

  Serial.begin(9600);

  // init color array with all white
  for (int i = 0; i < NUMPIXELS; i += 1) {
    allColors[i * 3] = 255;
    allColors[i * 3 + 1] = 255;
    allColors[i * 3 + 2] = 255;
  }// 

  // This initializes the NeoPixel library.
  pixels.begin();

  // To avoid burning people eyes
  pixels.setBrightness(255); // brightness in [0, 255]

  updateColor();
  //Serial.write("ready");
}


// let's loop!
void loop() {
  // send the "ready" message once per second:
  long now = millis();
  if (now - milliCounterReady > milliCounterReadyInterval) {
    milliCounterReady = now;
    Serial.println("ready");
  }
  

  
  if (Serial.available() > 0) {
    int nbChar = Serial.readBytes(allColors, NUMPIXELS * 3);
    Serial.println("data received");
    updateColor();
  }

  //Serial.write("cool!");
  //increment ++;

}
