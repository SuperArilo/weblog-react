import React, { useState } from 'react'
//组件
import { Slide } from '@mui/material'
import WaterWave from './WaterWave'
import Tinymce from './editor'
//样式
import style from '../assets/scss/createGossipWindow.module.scss'
//方法
import toast from 'react-hot-toast'
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
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
                </i>
                <p className={style.window_header_p}>发表碎语</p>
                <Tinymce
                    userInfo={props.userInfo}
                    placeholder='在这里输入内容哦'
                    getContent={content => {
                        if(!gossipInstance.status) {
                            if(content === '<p></p>' || content === null || content === '') {
                                toast('内容不能为空哦！')
                                return
                            }
                            setGossipInstance({...gossipInstance, status: true})
                            let data = new FormData()
                            data.append('content', content)
                            userCreateGossip({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                if(resq.code === 200) {
                                    props.setCreateGossipWindowStatus(false)
                                }
                                setGossipInstance({...gossipInstance, status: false})
                            }).catch(err => {
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