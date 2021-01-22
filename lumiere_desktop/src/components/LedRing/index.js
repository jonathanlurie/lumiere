import React from 'react'
import { SwatchesPicker, ChromePicker } from 'react-color'
import { Button } from 'antd'
import {
  BulbOutlined
} from '@ant-design/icons'
import Styles from './styles.css'


const NB_LED = 24

export default class LedRing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      colors: (new Uint8Array(NB_LED * 3)).fill(255),
      showColorPicker: false,
      pickedColor: {r: 255, g: 255, b: 255},
      selectedLedIndex: null,
    }
    this._svgContainerRef = React.createRef()
    this._svgCircles = []
    this._svgHalos = []


  }

  componentDidMount() {
    const size = 400
    const nbLed = NB_LED
    const center = size / 2
    const radiusLed = 0.25 * Math.PI * size / NB_LED //20
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

      circle.addEventListener('mousedown', (evt) => {
        // const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        // evt.target.style.fill = randomColor

        // this._svgHalos[circleIndex].style.fill = randomColor
        let circleIndex = parseInt(evt.target.id)

        if (this.state.selectedLedIndex === circleIndex) {
          this.setState({
            showColorPicker: false,
            selectedLedIndex: null,
          })
          return
        }

        this.setState({
          showColorPicker: true,
          pickedColor: {
            r: this.state.colors[circleIndex * 3],
            g: this.state.colors[circleIndex * 3 + 1],
            b: this.state.colors[circleIndex * 3 + 2] ,
          },
          selectedLedIndex: circleIndex,
        })

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


  onUpdateColor = (evt) => {
    // console.log(evt)
    const rgb = evt.rgb
    const ledIndex = this.state.selectedLedIndex

    if (ledIndex >= 0) {
      this.state.colors[ledIndex * 3] = rgb.r
      this.state.colors[ledIndex * 3 + 1] = rgb.g
      this.state.colors[ledIndex * 3 + 2] = rgb.b

      this._svgCircles[ledIndex].style.fill = evt.hex
      this._svgHalos[ledIndex].style.fill = evt.hex

      this.setState({pickedColor: evt.rgb})

      if (typeof this.props.onUniqueLedChange === 'function') {
        this.props.onUniqueLedChange(ledIndex, evt)
      }
    } else {

      // change global
      for (let i = 0; i < NB_LED; i += 1) {
        this.state.colors[i * 3] = rgb.r
        this.state.colors[i * 3 + 1] = rgb.g
        this.state.colors[i * 3 + 2] = rgb.b
        this._svgCircles[i].style.fill = evt.hex
        this._svgHalos[i].style.fill = evt.hex
      }
      this.setState({pickedColor: evt.rgb})
      if (typeof this.props.onGlobalLedChange === 'function') {
        this.props.onGlobalLedChange(evt)
      }
    }
  }


  onOk = () => {
    this.setState({
      showColorPicker: false,
      selectedLedIndex: null,
    })
  }


  onUpdateGlobalColor = () => {
    this.setState({
      showColorPicker: true,
      pickedColor: {
        r: 128,
        g: 128,
        b: 128,
      },
      selectedLedIndex: -1,
    })
  }

  render() {
    return (
      <div className={Styles['ring-container']}>
        <Button
          type="text"
          shape="circle"
          size='large'
          className={Styles['global-color-button']}
          icon={<BulbOutlined style={{color: '#fff'}}/>}
          onClick={this.onUpdateGlobalColor}
        />
        <div ref={this._svgContainerRef} />
        <div className={Styles['color-picker-container']}>
          {
            this.state.showColorPicker ?
            <div>
              <ChromePicker disableAlpha={true} color={this.state.pickedColor} onChange={this.onUpdateColor}/>
              <Button style={{marginTop: 5}} type='primary' size='small' onClick={this.onOk}>ok</Button>
            </div>
            :
            null
          }
        </div>
      </div>
    )
  }
}
