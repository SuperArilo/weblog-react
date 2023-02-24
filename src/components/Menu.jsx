import React, { useEffect, useState, useRef } from 'react'
//组件
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Icon from './Icon'
//样式
import style from '../assets/scss/components/menu.module.scss'
export default function AsukaMenu(props) {

    return (
        <Menu
            anchorEl={props.targetElement}
            open={props.open}
            autoFocus={false}
            onClose={() => { props.onClose(false) }}>
            {
                props.renderObject.map(item => {
                    return (
                        <MenuItem
                            disableGutters={false}
                            key={item.id}
                            onClick={() => { props.onClickItem(item.id) }}>
                            {
                                item.iconClass === '' || item.iconClass === undefined ? '':<Icon iconClass={item.iconClass} />
                            }
                            <span className={style.asuka_menu_span}>
                                {item.title}
                            </span>
                        </MenuItem>
                        
                    )
                })
            }
      </Menu>
    )
}
AsukaMenu.defaultProps = {
    targetElement: null,
    open: false,
    onClose: () => { return null },
    onClickItem: () => { return null },
    renderObject: [
        {
            id: 0,
            title: '未设置',
            iconClass: ''
        }
    ]
}