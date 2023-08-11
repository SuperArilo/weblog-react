import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import Avatar from '../components/Avatar'
import Skeleton from '@mui/material/Skeleton'
import { SwitchTransition, CSSTransition, TransitionGroup } from 'react-transition-group'

import style from '../assets/scss/friends.module.scss'
import '../assets/scss/currencyTransition.scss'
import { friendGet } from '../util/friend'
import toast from 'react-hot-toast'

export default function Friends(props) {

    //hook
    const navigate = useNavigate()
    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 30
    })
    const [dataInstance, setDataInstance] = useState({
        current: 0,
        pages: 0,
        size: 0,
        total: 0,
        list: null
    })

    const friendsListGet = useCallback(instance => {
        friendGet(instance).then(resq => {
            if(resq.code === 200) {
                setDataInstance(target => {
                    return {
                        ...target,
                        current: resq.data.current,
                        pages: resq.data.pages,
                        size: resq.data.size,
                        total: resq.data.total,
                        list: resq.data.list
                    }
                })
            }
        }).catch(err => {})
    }, [])

    useEffect(() => {
        friendsListGet(requestInstance)
    }, [requestInstance, friendsListGet])
    return (
        <div className={style.friends_box}>
            <div className={style.friends_list}>
                <SwitchTransition mode='out-in'>
                    <CSSTransition key={dataInstance.list === null} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                        {
                            dataInstance.list === null ?
                            <FriendsSkeleton />
                            :
                            <>
                                {
                                    dataInstance.list.length === 0 ?
                                    <span>没有数据</span>
                                    :
                                    dataInstance.list.map(item => {
                                        return (
                                            <div className={style.friends_list_item} key={item.id}>
                                                <Avatar
                                                    src={item.avatar}
                                                    width='3rem'
                                                    height='3rem'
                                                    onClick={() => {
                                                        navigate('/user/' + item.uid)
                                                    }}
                                                    />
                                                <span className={style.friend_name}>{item.nickName}</span>
                                                <span className={style.time_ago}>{item.visitTimeFormat}来过</span>
                                            </div>
                                        )
                                    })
                                }
                            </>
                        }
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </div>
    )
}
const FriendsSkeleton = () => {
    return (
        <div className={style.skeleton_item}>
            <Skeleton variant="circular" width='3rem' height='3rem' />
            <Skeleton variant="text" width='6rem' height='1.2rem' />
            <Skeleton variant="text" width='6rem' height='1rem' />
        </div>
    )
}