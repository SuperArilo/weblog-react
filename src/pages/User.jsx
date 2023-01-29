import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
//样式
import style from '../assets/scss/user.module.scss'
//方法
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from "react-router-dom"
import $ from 'jquery'
import { blogUserProfiles } from '../util/user'
import customTips from '../util/notostack/customTips'
//组件
import Gossip from './gossip'
import Avatar from '../components/Avatar'
import WaterWave from 'water-wave'

export default function User(props) {
    //hook
    const navigate = useNavigate()
    //params
    const userInfo = useSelector((state) => state.userInfo.info)
    const [userProfiles, setUserProfiles] = useState(null)
    const { viewUid } = useParams()
    const [infoMenuIndex, setInfoMenuIndex] = useState(0)
    const [infoMenuList, setInfoMenuList] = useState([
        {
            id: 0,
            title: '资料',
            icon: 'info'
        },
        {
            id: 1,
            title: '碎语',
            icon: 'gossip'
        },
        {
            id: 2,
            title: '点赞',
            icon: 'ulike'
        }
    ])
    //ref
    const menuLineRef = useRef(null)

    const queryProfiles = useCallback(params => {
        blogUserProfiles(params).then(resq => {
            if(resq.code === 200) {
                setUserProfiles(resq.data)
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }, [])

    useEffect(() => {
        queryProfiles(viewUid)
    }, [viewUid, queryProfiles])

    return (
        <div className={style.user_info}>
            {
                userProfiles === null ? <UserSkeleton />:
                <div className={style.info_box}>
                    <div className={style.user_head_box}>
                        <Avatar width='3.8rem' height='3.8rem' src={userProfiles.avatar} />
                        <p>{userProfiles.nickName}</p>
                        <span className={style.autograph}>{userProfiles.autograph}</span>
                    </div>
                    <div className={style.function_box}>
                        <header className={style.select_title}>
                            <div ref={menuLineRef} className={style.select_line} type='line' />
                            {
                                infoMenuList.map(item => {
                                    return (
                                        <div
                                            className={`${style.select_title_item} ${infoMenuIndex === item.id ? style.select_title_item_active:''}`}
                                            index={item.id}
                                            key={item.id}
                                            onClick={() => {
                                                setInfoMenuIndex(item.id)
                                                $(menuLineRef.current).css({ left: $($('div[index]')[item.id]).width() * item.id })
                                            }}>
                                            <i className={`${'asukamis'} ${item.icon}`} />
                                            <span>{item.title}</span>
                                            <WaterWave color="rgb(155, 195, 219)" duration={ 500 } />
                                        </div>
                                    )
                                })
                            }
                        </header>
                        <div className={style.sleect_function_box}>
                            <RenderFunctionView index={infoMenuIndex} userProfiles={userProfiles} userInfo={userInfo} viewUid={viewUid} />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
const UserInfoView = (props) => {
    return (
        <ul className={style.user_info_view}>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis ucontact' />
                    <span>联系方式</span>
                </div>
                <div className={style.info_content}>
                    <span>{props.userProfiles.email}</span>
                </div>
            </li>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis calendar' />
                    <span>注册时间</span>
                </div>
                <div className={style.info_content}>
                    <span>{props.userProfiles.registerTime}</span>
                </div>
            </li>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis identity' />
                    <span>身份标签</span>
                </div>
                <div className={style.info_content}>
                    <span>{props.userProfiles.category}</span>
                </div>
            </li>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis calendar' />
                    <span>年龄</span>
                </div>
                <div className={style.info_content}>
                    <span>{props.userProfiles.age}</span>
                </div>
            </li>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis sex' />
                    <span>性别</span>
                </div>
                <div className={style.info_content}>
                    <span>{props.userProfiles.sex === 0 ? '女':'男'}</span>
                </div>
            </li>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis location' />
                    <span>位置</span>
                </div>
                <div className={style.info_content}>
                    <span>{props.userProfiles.location}</span>
                </div>
            </li>
        </ul>
    )
}
const RenderFunctionView = ({ index, userProfiles, userInfo, viewUid }) => {
    switch(index) {
        case 0:
            return <UserInfoView userProfiles={userProfiles} />
        case 1:
            return <Gossip userInfo={userInfo} viewUid={viewUid} />
        case 2:
            return <span>开发中</span>
        default:
            break
    }
}
const UserSkeleton = () => {
    return (
        <div className={style.user_skeleton}></div>
    )
}