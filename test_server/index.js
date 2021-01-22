// serial port initialization:
const SerialPort = require('serialport'); // include the serialport library

const NUMPIXELS = 24
const portName = '/dev/tty.usbmodem14201'
const myPort = new SerialPort(portName, {
  baudRate: 9600,
  databits: 8,
})
const colorData = new Uint8Array(NUMPIXELS * 3)
let isReady = false
 
// these are the definitions for the serial events:
myPort.on('open', () => {
  console.log('port open')
}) // called when the serial port opens


myPort.on('data', (data) => {
  // a trim is necessary because on the board side, Serial.println("...")
  // sends a \n terminated string
  const stringData = data.toString().trim()
  console.log('Received from port:', stringData)
  
  if (stringData === 'ready' && !isReady) {
    console.log('The board is ready.')
    isReady = true
    // sendData()
    setInterval(sendData, 200)
  }

})

// true white: R255 G255 B255
// natural white: R255 G246 B222
// warm white: R255, G219, B122


function sendData() {
  makeSolidColor(Math.random() * 100, Math.random() * 100, Math.random() * 100)
  // makePolishFlag()
  // makeSwissFlag()
  // makeRandomColor(80)

  // convert the value to an ASCII string before sending it:
  myPort.write(colorData, function (err, result) {
    if (err) {
      console.log('Error while sending message : ' + err);
    }
    if (result) {
      console.log('Response received after sending message : ' + result);
    }
    console.log('message written')
  })
}


function makeSolidColor(r, g, b) {
  for (let i = 0; i < NUMPIXELS; i += 1) {
    colorData[i * 3] = r
    colorData[i * 3 + 1] = g
    colorData[i * 3 + 2] = b
  }
}


function makeRandomColor(factor = 255) {
  for (let i = 0; i < NUMPIXELS; i += 1) {
    colorData[i * 3] = Math.random() * factor
    colorData[i * 3 + 1] = Math.random() * factor
    colorData[i * 3 + 2] = Math.random() * factor
  }
}


function makePolishFlag() {
  for (let i = 0; i < NUMPIXELS; i += 1) {
    if (i > 6 && i < 18) {
      colorData[i * 3] = 255
      colorData[i * 3 + 1] = 0
      colorData[i * 3 + 2] = 0
    } else {
      colorData[i * 3] = 200
      colorData[i * 3 + 1] = 200
      colorData[i * 3 + 2] = 200
    }
  }
}

function makeSwissFlag() {
  for (let i = 0; i < NUMPIXELS; i += 1) {
    if (i%6 === 0) {
      colorData[i * 3] = 160
      colorData[i * 3 + 1] = 160
      colorData[i * 3 + 2] = 160
    } else {
      colorData[i * 3] = 200
      colorData[i * 3 + 1] = 0
      colorData[i * 3 + 2] = 0
    }
  }
}