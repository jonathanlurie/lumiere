/*
  The interchange app must be installed with:
  sudo npm install -g nodebots-interchange --unsafe-perm=true --allow-root

  then, falsh the arduino firmware with:
  interchange install git+https://github.com/ajfisher/node-pixel -a nano --firmata

  ('nano' can be 'uno' or other depending on the board model)

*/

const Five = require('johnny-five')
const pixel = require("node-pixel")

const board = new Five.Board()
let strip = null

board.on('ready', function() {
  // const led = new Five.Led(13)
  // led.blink(500)

  // Define our hardware.
  // It's a 12px ring connected to pin 6.
  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 7, length: 24}, ],
    gamma: 2.8,
  });

  // Just like DOM-ready for web developers.
  strip.on("ready", function() {
    // Set the entire strip to pink.
    //strip.color('#555')
    //strip.off()

    //strip.pixel(0).color('#f00')

    // Send instructions to NeoPixel.
    //strip.show();
  
    setInterval(() => {
      // strip.color('#333')
      // const pixelIndex = Math.floor(Math.random() * 24)
      
      // strip.pixel(pixelIndex).color('#f00')
      for (let i = 0; i < 24; i += 1) {
        const randomColor = "#000000".replace(/0/g,() => {return (~~(Math.random()*16)).toString(16)})
        strip.pixel(i).color(randomColor)
      }
      strip.show()
    }, 10)

  
  
  
  
  });

  // Allows for command-line experimentation!
  this.repl.inject({
    strip: strip
  });

})

