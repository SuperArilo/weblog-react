//组件
import WaterWave from './WaterWave'
//样式
import style from '../assets/scss/components/Icon.module.scss'
export default function Icon(props) {
    return (
        <i 
            style={{ width: props.width, height: props.height, fontSize: props.fontSize }}
            className={`${style.asukamis_icon} ${'asukamis'} ${props.iconClass}`}
            onClick={props.onClick}>
                <WaterWave color="rgb(155, 195, 219)" duration={ 1 } />
            </i>
    )
}
Icon.defaultProps = {
    width: '1.6rem',
    height: '1.6rem',
    fontSize: '1rem',
    iconClass: '',
    onClick: () => { return null }
}