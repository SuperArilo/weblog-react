import React, { useEffect, useState } from 'react'
//样式
import style from '../assets/scss/components/avatar.module.scss'
export default class Avatar extends React.Component {
    static defaultProps = {
        width: '2.5rem',
        height: '2.5rem',
        src: undefined,
        title: '未设置',
        alt: '未设置'
    }
    render() {
        return (
            <img
                style={
                    {
                        'width': this.props.width,
                        'height': this.props.height,
                        'minHeight': this.props.height,
                        'minWidth': this.props.width
                    }
                }
                onClick={this.props.onClick}
                className={style.avatar}
                src={this.props.src}
                title={this.props.title}
                alt={this.props.alt}/>
        )
    }
}