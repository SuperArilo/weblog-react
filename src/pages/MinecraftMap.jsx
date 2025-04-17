import style from './MinecraftMap.module.scss'
import { BASE_URL } from '../util/Request'
export default function MinecraftMap() {

    return (
        <div className={style['map_page']}>
            <span className={style.map_title}>凡尔赛小镇服务器</span>
            <iframe src={`${BASE_URL}/map.html`} />
        </div>
    )
}