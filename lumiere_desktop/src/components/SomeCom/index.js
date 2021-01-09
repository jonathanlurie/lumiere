import React from 'react'
import fs from 'fs'
import Styles from './styles.css'

export default class SomeCom extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    fs.writeFileSync('text.txt', 'azerty')
  }

  render() {
    return (
      <div className={Styles['some-div']}>
        helloooooo from SomeCom
      </div>
    )
  }
}
