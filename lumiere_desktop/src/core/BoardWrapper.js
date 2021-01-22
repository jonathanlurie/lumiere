import Five from 'johnny-five'
import Pixel from 'node-pixel'

export default class BoardWrapper {
  constructor() {
    this.board = null
    this.strip = null
  }


  detect() {
    const board = new Five.Board({
      repl: false,
    })
    let strip = null

    board.on('ready', () => {
      this.board = board
      const led = new Five.Led(13)
      led.blink(500)

      // Define the LED hardware
      strip = new Pixel.Strip({
        board: board,
        controller: 'FIRMATA',
        strips: [ {pin: 7, length: 24}, ],
        gamma: 2.8,
      })

      strip.on("ready", () => {
        this.strip = strip
        // strip.color('#555')
        // strip.pixel(0).color('#f00')
        // strip.show()
      })
    })
  }


  setUniqueColor(ledIndex, color, show = true) {
    this.strip.pixel(ledIndex).color(color)

    if (show) {
      this.strip.show()
    }
  }


  setGlobalColor(color, show = true) {
    this.strip.color(color)

    if (show) {
      this.strip.show()
    }
  }

}
