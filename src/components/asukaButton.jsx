import React from 'react'
import WaterWave from 'water-wave'
import 'water-wave/style.css'
import '../assets/scss/components/button.scss'
export default class AsukaButton extends React.Component {
    static defaultProps = {
        text: '未设置',
        status: false,
        class: 'normal',
        size: 'normal'
    }
    render() {
        return(
            <button onClick={this.props.onClick} className={`${'asuka-button'} ${'asuka-button-' + this.props.class} ${'button-size-' + this.props.size}`} type='button'>
                { this.props.status ? <i className='fas fa-circle-notch fa-spin' />:this.props.text }
                <WaterWave color={`${this.props.class === 'normal' ? 'rgba(0, 0, 0, 0.7)':''} ${this.props.class === 'read' ? 'rgb(228, 177, 177)':''}`} duration={ 500 } />
            </button>
        )
    }
}