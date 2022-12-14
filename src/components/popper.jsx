import React, { useEffect, useState, useRef } from 'react'
//组件
import Popper from '@mui/material/Popper'
import Zoom from '@mui/material/Zoom'
import AsukaButton from './asukaButton'
//样式
import style from '../assets/scss/components/popper.module.scss'
const AsukaPopper = (props) => {
    return (
        <Popper open={props.open} anchorEl={props.target} placement={props.placement} transition disablePortal>
            {({ TransitionProps }) => (
                <Zoom {...TransitionProps} timeout={350}>
                    <div className={style.popper_box}>
                        <p>{props.title}</p>
                        <div>
                            <AsukaButton text='确定' status={props.status} size='small' onClick={ () => props.onConfirm() } />
                            <AsukaButton text='取消' class='danger' size='small' onClick={ () => props.onCancel() }/>
                        </div>
                    </div>
                </Zoom>
            )}
        </Popper>
    )
}
AsukaPopper.defaultProps = {
    title: '未设置',
    open: false,
    status: false,
    placement: 'bottom-start',
    target: null
}
export default AsukaPopper