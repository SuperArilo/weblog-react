import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react'
//组件
import WaterWave from 'water-wave'
//样式
import style from '../assets/scss/components/Icon.module.scss'
const Icon = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => {

    })
    return (
        <i 
            style={{ width: props.width, height: props.height, fontSize: props.fontSize }}
            className={`${style.asukamis_icon} ${'asukamis'} ${props.iconClass} ${props.status && style.rotate}`}
            onClick={props.onClick}>
                <WaterWave color="rgb(155, 195, 219)" duration={ 500 } />
            </i>
    )
})
Icon.defaultProps = {
    width: '1.6rem',
    height: '1.6rem',
    fontSize: '1rem',
    status: false,
    iconClass: '',
    onClick: () => { return null }
}
export default Icon