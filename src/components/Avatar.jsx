import React, { useEffect, useState } from 'react'
//样式
import style from '../assets/scss/components/avatar.module.scss'
export default function Avatar(props) {
    return (
        <div
                className={style.avatar}
                style={
                    {
                        'width': props.width,
                        'height': props.height,
                        'minHeight': props.height,
                        'minWidth': props.width
                    }
                }>
                <img
                    onClick={props.onClick}
                    className={style.avatar}
                    src={props.src}
                    title={props.title}
                    alt={props.alt}/>
            </div>
    )
}
Avatar.defaultProps = {
    width: '2.5rem',
    height: '2.5rem',
    src: undefined,
    title: '未设置',
    alt: '未设置'
}