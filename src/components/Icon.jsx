//组件
import WaterWave from './WaterWave'
//样式
import style from '../assets/scss/components/Icon.module.scss'
import Svg from 'react-inlinesvg'
export default function Icon({
    width = '1.5rem',
    height = '1.5rem',
    fontSize = '1rem',
    src = 'https://cdn.svgporn.com/logos/firefox.svg',
    count = '',
    onClick = () => null }) {
    return (
        <div className={style.icon_box} onClick={e => { onClick(e) }}>
            <WaterWave color="rgb(155, 195, 219)" duration={ 1 } />
            <Svg
                cacheRequests={true}
                src={src}
                width={width}
                height={height}
                fontSize={fontSize}/>
            {
                count !== '' ? <span className={style.count}>{ count >= 100 ? '99+':count }</span>:''
            }
        </div>
    )
}