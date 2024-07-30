//组件
import WaterWave from './WaterWave'
//样式
import style from './Icon.module.scss'
import Svg from './Svg'
import { useState } from 'react'
export default function Icon({ width = '1.5rem', height = '1.5rem', fontSize = '1rem', name = 'Dark', count = '', onClick = () => null }) {
    const [svgStyle, setSvgStyle] = useState({
        width: width,
        height: height,
        fontSize: fontSize
    })
    return (
        <div className={style.icon_box} onClick={e => { onClick(e) }}>
            <WaterWave color="rgb(155, 195, 219)" duration={ 1 } />
            <Svg name={name} style={svgStyle} />
        </div>
    )
}