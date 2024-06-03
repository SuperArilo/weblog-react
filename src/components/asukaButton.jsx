import React from 'react'
import WaterWave from './WaterWave'
import style from '../assets/scss/components/button.module.scss'
export default function AsukaButton({text = '未设置', clazz = 'normal', size = 'normal', getFile = () => null, onClick = () => null}) {
    return (
        <button
            onClick={onClick}
            className={`${style.asuka_button} ${clazz === 'normal' ? style.asuka_button_normal:''} ${clazz === 'read' ? style.asuka_button_read:''} ${clazz === 'danger' ? style.asuka_button_danger:''} ${clazz === 'file' ? style.asuka_button_file:''} ${size === 'normal' ? style.button_size_normal:''} ${size === 'big' ? style.button_size_big:''} ${size === 'small' ? style.button_size_small:''}`}
            title={clazz === 'file' ? '点击上传':'提交'}
            type='button'>
            {
                text
            }
            {
                clazz === 'file' ? 
                <label>
                    <input
                        type='file'
                        accept="image/*"
                        onChange={e => {
                            let files = {...e.target.files}
                            getFile(files[0])
                            e.target.value = ''
                        }}/>
                </label>
                :
                null
            }
            <WaterWave
                color={`${clazz === 'normal' ? 'rgba(0, 0, 0, 0.7)':''} ${clazz === 'read' ? 'rgb(228, 177, 177)':''}`}
                duration={ 1 } />
        </button>
    )
}