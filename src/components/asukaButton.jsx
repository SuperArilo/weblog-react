import React from 'react'
import WaterWave from 'water-wave'
import 'water-wave/style.css'
import style from '../assets/scss/components/button.module.scss'

export default class AsukaButton extends React.Component {
    render() {
        return(
            <button onClick={this.props.onClick} className={`${style.asuka_button} ${this.props.class === 'normal' || this.props.class === undefined ? style.normal:''} ${this.props.class === 'read' ? style.read:''}`} type='button'>
                {this.props.text}
                <WaterWave color={`${this.props.class === undefined || this.props.class === 'normal' ? 'rgba(0, 0, 0, 0.7)':''} ${this.props.class === 'read' ? 'rgb(228, 177, 177)':''}`} duration={ 500 } />
            </button>
        )
    }
}