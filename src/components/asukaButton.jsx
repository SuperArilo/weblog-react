import React from 'react'
import WaterWave from 'water-wave'
import 'water-wave/style.css'
import style from '../assets/scss/components/button.module.scss'
export default function AsukaButton(props) {
    return (
        <button
            onClick={props.onClick}
            className={`${style.asuka_button} ${props.class === 'normal' ? style.asuka_button_normal:''} ${props.class === 'red' ? style.asuka_button_read:''} ${props.class === 'danger' ? style.asuka_button_danger:''} ${props.size === 'normal' ? style.button_size_normal:''} ${props.size === 'big' ? style.button_size_big:''} ${props.size === 'small' ? style.button_size_small:''}`}
            title='提交'
            type='button'>
            { 
                props.status ? 
                <i className={`${'asukamis loading'} ${props.status ? style.rotate:''}`} />
                :
                props.text
            }
            <WaterWave
                color={`${props.class === 'normal' ? 'rgba(0, 0, 0, 0.7)':''} ${props.class === 'read' ? 'rgb(228, 177, 177)':''}`}
                duration={ 500 } />
        </button>
    )
}
AsukaButton.defaultProps = {
    text: '未设置',
    status: false,
    class: 'normal',
    size: 'normal'
}