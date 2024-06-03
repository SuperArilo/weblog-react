import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import Avatar from '../components/Avatar'
import Skeleton from '@mui/material/Skeleton'
import { CTransitionFade } from '../components/Transition'

import style from '../assets/scss/friends.module.scss'
import { friendGet } from '../util/friend'

export default function Friends({ columns, defaultHeight = true }) {

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
        friendGet({ data: instance, toast: null }).then(resq => {
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
        <div className={style.friends_box} style={defaultHeight ? { minHeight: '83vh' }:{}}>
            <CTransitionFade
                    keyS={dataInstance.list === null}
                    left={<FriendsSkeleton />}
                    right={
                        <div className={style.friends_list} style={{ gridTemplateColumns: columns }}>
                            {
                                dataInstance.list?.length === 0 ?
                                <span>没有数据</span>
                                :
                                dataInstance.list?.map(item => {
                                    return (
                                        <div className={style.friends_list_item} key={item.id}>
                                            <Avatar
                                                src={item.avatar}
                                                width='3rem'
                                                height='3rem'
                                                title={item.nickName}
                                                alt='用户头像'
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
                        </div>
                    } />
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