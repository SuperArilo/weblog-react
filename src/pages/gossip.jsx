import React, { useState, useEffect, useCallback } from 'react'
//样式
import style from '../assets/scss/gossip.module.scss'
import '../assets/scss/currencyTransition.scss'
//组件
import { SwitchTransition, CSSTransition, TransitionGroup } from 'react-transition-group'
import Collapse from '@mui/material/Collapse'
import GossipContent from '../components/gossipContent'
import GossipSkeleton from '../components/GossipSkeleton'
//方法
import { gossipListRequest } from '../util/gossip'
import toast from 'react-hot-toast'
import { likeGossip } from '../util/gossip.js'
//hook
import { useParams, useNavigate, useLocation  } from "react-router-dom"
export default function Gossip(props) {

    //hook
    const { search } = useLocation()

    //params
    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10,
        viewUid: props.viewUid
    })
    const [gossipObject, setGossipObject] = useState({
        pages: 1,
        total: 0,
        list: null,
        current: 0,
    })

    const [selectGossipItem, setSelectGossipItem] = useState(null)

    const gossipDataGet = useCallback(instance => {
        gossipListRequest(instance).then(resq => {
            if(resq.code === 200) {
                setGossipObject(target => {
                    return {
                        ...target,
                        pages: resq.data.pages,
                        total: resq.data.total,
                        list: resq.data.list,
                        current: resq.data.current
                    }
                })
            }
        }).catch(err => {
            toast.error(err.message)
        })
    }, [])

    useEffect(() => {
        gossipDataGet(requestInstance)        
    }, [requestInstance, gossipDataGet])

    useEffect(() => {
        let searchParams = new URLSearchParams(search)
        console.log(searchParams)
    }, [search])

    return (
        <div className={style.gossip_page} style={{ paddingTop: requestInstance.viewUid ? null:'1rem' }}>
            <SwitchTransition mode='out-in'>
                <CSSTransition key={gossipObject.list === null} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                    {
                        gossipObject.list === null ?
                        <GossipSkeleton />
                        :
                        <>
                            {
                                gossipObject.list.length === 0 ? <span className={style.gossip_empty}>TA还没有写过碎语</span>:
                                <TransitionGroup>
                                    {
                                        gossipObject.list.map(item => {
                                            return (
                                                <Collapse key={item.id}>
                                                    <GossipContent
                                                        userInfo={props.userInfo} 
                                                        data={item}
                                                        gossipDataGet={gossipDataGet}
                                                        requestInstance={requestInstance}
                                                        foldStatus={selectGossipItem === item.id}
                                                        handleFold={id => {
                                                            setSelectGossipItem(selectGossipItem === id ? null:id)
                                                        }}
                                                        handleLike={(gossipId) => {
                                                            if(props.userInfo === null) {
                                                                toast('你需要登录哦 (￣y▽,￣)╭ ')
                                                                return
                                                            }
                                                            toast.loading('加载中...')
                                                            let data = new FormData()
                                                            data.append('gossipId', gossipId)
                                                            likeGossip(data).then(resq => {
                                                                toast.remove()
                                                                if(resq.code === 200) {
                                                                    toast.success(resq.message)
                                                                    let [...temp] = gossipObject.list
                                                                    let index = temp.findIndex(item => item.id === gossipId)
                                                                    temp[index].like = resq.data.status
                                                                    temp[index].likes = resq.data.likes
                                                                    setGossipObject({...gossipObject, list: temp})
                                                                } else {
                                                                    toast.error(resq.message)
                                                                }
                                                            }).catch(err => {
                                                                toast.remove()
                                                                toast.error(err.message)
                                                            })
                                                        }}
                                                        handleGossipList={() => {
                                                            gossipData(gossipRequestInstance)
                                                        }}/>
                                                </Collapse>
                                            )
                                        })
                                    }
                                </TransitionGroup>
                            }
                        </>
                    }
                </CSSTransition>
            </SwitchTransition>
        </div>
    )
}