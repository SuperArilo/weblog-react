import React from 'react'
import WaterWave from './WaterWave'
import style from '../assets/scss/components/button.module.scss'
export default function AsukaButton(props) {
    return (
        <button
            onClick={props.onClick}
            className={`${style.asuka_button} ${props.class === 'normal' ? style.asuka_button_normal:''} ${props.class === 'read' ? style.asuka_button_read:''} ${props.class === 'danger' ? style.asuka_button_danger:''} ${props.class === 'file' ? style.asuka_button_file:''} ${props.size === 'normal' ? style.button_size_normal:''} ${props.size === 'big' ? style.button_size_big:''} ${props.size === 'small' ? style.button_size_small:''}`}
            title={props.class === 'file' ? '点击上传':'提交'}
            type='button'>
            {
                props.text
            }
            {
                props.class === 'file' ? 
                <label>
                    <input
                        type='file'
                        accept="image/*"
                        onChange={e => {
                            let files = {...e.target.files}
                            props.getFile(files[0])
                            e.target.value = ''
                        }}/>
                </label>
                :
                null
            }
            <WaterWave
                color={`${props.class === 'normal' ? 'rgba(0, 0, 0, 0.7)':''} ${props.class === 'read' ? 'rgb(228, 177, 177)':''}`}
                duration={ 1 } />
        </button>
    )
}
AsukaButton.defaultProps = {
    text: '未设置',
    class: 'normal',
    size: 'normal',
    getFile: () => {
        return null
    }
}