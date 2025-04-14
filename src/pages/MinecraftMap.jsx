import style from './MinecraftMap.module.scss'

export default function MinecraftMap() {

    return (
        <div className={style['map_page']}>
            <span className={style.map_title}>凡尔赛小镇服务器</span>
            <iframe src="http://superarilo.icu:8100" />
        </div>
    )
}