//组件
import WaterWave from './WaterWave'
//样式
import style from '../assets/scss/components/Icon.module.scss'
import Svg from 'react-inlinesvg'
export default function Icon(props) {
    return (
        <div className={style.icon_box} onClick={e => { props.onClick(e) }}>
            <WaterWave color="rgb(155, 195, 219)" duration={ 1 } />
            <Svg
                cacheRequests={true}
                src={props.src}
                width={props.width}
                height={props.height}
                fontSize={props.fontSize}/>
        </div>
    )
}
Icon.defaultProps = {
    width: '1.5rem',
    height: '1.5rem',
    fontSize: '1rem',
    src: 'https://cdn.svgporn.com/logos/firefox.svg',
    onClick: () => { return null }
}