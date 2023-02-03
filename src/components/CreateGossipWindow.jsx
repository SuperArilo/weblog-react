import React, { useState, useEffect, useCallback } from 'react'
//组件
import { Slide } from '@mui/material'
import WaterWave from 'water-wave'
import Tinymce from './editor'
//样式
import style from '../assets/scss/createGossipWindow.module.scss'
//方法
import customTips from '../util/notostack/customTips'
import { userCreateGossip } from '../util/gossip'

export default function CreateGossipWindow(props) {

    //params
    const [gossipInstance, setGossipInstance] = useState({
        status: false,
    })

    return (
        <Slide direction="up" in={props.status} mountOnEnter unmountOnExit>
            <div className={style.create_gossip_window}>
                <i
                    className={`${'asukamis back'} ${style.window_header}`}
                    onClick={() => {
                        setTimeout(() => { props.setCreateGossipWindowStatus(false) }, 500)
                    }}>
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                </i>
                <p className={style.window_header_p}>发表碎语</p>
                <Tinymce
                    status={gossipInstance.status}
                    getContent={content => {
                        if(!gossipInstance.status) {
                            if(content === '<p></p>' || content === null || content === '') {
                                customTips.warning('内容不能为空哦！')
                                return
                            }
                            setGossipInstance({...gossipInstance, status: true})
                            let data = new FormData()
                            data.append('content', content)
                            userCreateGossip(data).then(resq => {
                                if(resq.code === 200) {
                                    customTips.success(resq.message)
                                } else {
                                    customTips.error(err.message)
                                }
                                setGossipInstance({...gossipInstance, status: false})
                                props.setCreateGossipWindowStatus(false)
                            }).catch(err => {
                                customTips.error(err.message)
                                setGossipInstance({...gossipInstance, status: false})
                                props.setCreateGossipWindowStatus(false)
                            })
                        }
                    }}/>
            </div>
        </Slide>
    )
}
CreateGossipWindow.defaultProps = {
    status: false
}