import React from 'react'
import { useSelector } from 'react-redux'
import WaterWave from './WaterWave'
import style from './Button.module.scss'
import ThemeStyle from './Button.Theme.module.scss'
export default function Button({text = '未设置', clazz = 'normal', size = 'normal', getFile = () => null, onClick = () => null}) {
    //theme
	const isDark = useSelector(state => state.theme.isDark)

    return (
        <div className={`${isDark ? ThemeStyle.dark_button:ThemeStyle.light_button} ${style.as_button}`} style={{ width: size == 'big' ? '100%':null }}>
            <button
                onClick={onClick}
                className={`${ThemeStyle['asuka_button_' + clazz]} ${style['button_size_' + size]}`}
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
        </div>
        
    )
}