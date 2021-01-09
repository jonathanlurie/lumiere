import React from 'react'

export default class LedRing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this._svgContainerRef = React.createRef()
    this._svgCircles = []
    this._svgHalos = []
  }

  componentDidMount() {
    const size = 400
    const nbLed = 24
    const center = size / 2
    const radiusLed = 0.25 * Math.PI * size / 24 //20
    const border = 30
    const radiusRing = size / 2 - radiusLed - border

    console.log('this._svgContainerRef', this._svgContainerRef)
    const NS = 'http://www.w3.org/2000/svg'

    const svgCanvas = document.createElementNS(NS, 'svg')
    svgCanvas.setAttribute('xmlns', NS)
    svgCanvas.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    svgCanvas.setAttribute('height', size)
    svgCanvas.setAttribute('width', size)
    svgCanvas.setAttribute('style', `background-color: #000000;`)
    svgCanvas.setAttribute('viewBox', `0 0 ${size} ${size}`)

    // adding the blur filter for the led
    const filter = document.createElementNS( NS, "filter" )
    filter.setAttribute( "id", "blur3" )
    const blur = document.createElementNS( NS, "feGaussianBlur" )
    blur.setAttribute( "stdDeviation", 3 )
    filter.appendChild( blur )
    svgCanvas.appendChild( filter )


    // adding the blur filter for the led background
    const filter2 = document.createElementNS( NS, "filter" )
    filter2.setAttribute( "id", "blur13" )
    const blur2 = document.createElementNS( NS, "feGaussianBlur" )
    blur2.setAttribute( "stdDeviation", 13 )
    filter2.appendChild( blur2 )
    svgCanvas.appendChild( filter2 )

    const ledHaloGroup = document.createElementNS(NS, 'g')
    svgCanvas.appendChild(ledHaloGroup)
    ledHaloGroup.setAttributeNS(null, 'filter', "url(#blur13)")

    const ledGroup = document.createElementNS(NS, 'g')
    svgCanvas.appendChild(ledGroup)
    ledGroup.setAttributeNS(null, 'filter', "url(#blur3)")

    this._svgContainerRef.current.appendChild(svgCanvas)


    for (let i = 0; i < nbLed; i += 1) {
      const theta = i * (2 * Math.PI) / nbLed
      const circle = document.createElementNS(NS, 'circle')
      circle.setAttributeNS(null, 'cx', center + radiusRing * Math.cos(theta))
      circle.setAttributeNS(null, 'cy', center + radiusRing * Math.sin(theta))
      circle.setAttributeNS(null, 'r', radiusLed)
      circle.setAttributeNS(null, 'id', i)
      circle.setAttributeNS(null, 'style', `fill: white; opacity: 1.0; stroke-width: 0;`)
      ledGroup.appendChild(circle)
      this._svgCircles.push(circle)

      circle.addEventListener('mouseenter', (evt) => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        evt.target.style.fill = randomColor
        let circleIndex = parseInt(evt.target.id)
        this._svgHalos[circleIndex].style.fill = randomColor
      })

      const halo = document.createElementNS(NS, 'circle')
      halo.setAttributeNS(null, 'cx', center + radiusRing * Math.cos(theta))
      halo.setAttributeNS(null, 'cy', center + radiusRing * Math.sin(theta))
      halo.setAttributeNS(null, 'r', radiusLed)
      // circle.setAttributeNS(null, 'id', `halo_${i}`)
      halo.setAttributeNS(null, 'style', `fill: white; opacity: 1.0; stroke-width: 0;`)
      ledHaloGroup.appendChild(halo)
      this._svgHalos.push(halo)


    }

  }


  onLedClick = (evt) => {
    console.log(evt)
  }

  render() {
    return (
      <div ref={this._svgContainerRef} >
      </div>
    )
  }
}
