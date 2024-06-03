//样式
import style from '../assets/scss/components/avatar.module.scss'
export default function Avatar({ width = '2.5rem', height = '2.5rem', src = undefined, shadow = false, title = '未设置', alt = '未设置', onClick = () => null }) {
    return (
        <div
            className={`${style.avatar} ${shadow && style.has_shadow}`}
            style={
                {
                    'width': width,
                    'height': height,
                    'minHeight': height,
                    'minWidth': width
                }
            }>
            <img
                onClick={onClick}
                className={style.avatar}
                src={src}
                title={title}
                alt={alt}/>
        </div>
    )
}