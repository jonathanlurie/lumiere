const SerialPort = require('serialport')


async function getPortsList () {
  const ports = await SerialPort.list()
  ports.forEach((port) => {
    console.log(port.path)
  })
}

getPortsList()