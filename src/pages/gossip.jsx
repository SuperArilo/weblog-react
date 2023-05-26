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

    let searchParams = new URLSearchParams(search)

    //params
    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10,
        viewUid: props.viewUid,
        targetId: searchParams.get('targetId'),
        commentId: searchParams.get('commentId')
    })
    const [gossipObject, setGossipObject] = useState({
        pages: 1,
        total: 0,
        instance: null,
        current: 0,
        targetGossip: null,
        targetComment: null
    })

    const [selectGossipItem, setSelectGossipItem] = useState(null)

    const gossipDataGet = useCallback(instance => {
        gossipListRequest(instance).then(resq => {
            if(resq.code === 200) {
                if(resq.data.targetGossip) {
                    resq.data.instance.list.splice(resq.data.instance.list.findIndex(item => item.id === resq.data.targetGossip.id), 1)
                }
                setGossipObject(target => {
                    return {
                        ...target,
                        pages: resq.data.instance.pages,
                        total: resq.data.instance.total,
                        instance: resq.data.instance,
                        current: resq.data.instance.current,
                        targetGossip: resq.data.targetGossip,
                        targetComment: resq.data.targetComment
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

    return (
        <div className={style.gossip_page} style={{ paddingTop: requestInstance.viewUid ? null:'1rem' }}>
            <SwitchTransition mode='out-in'>
                <CSSTransition key={gossipObject.instance === null} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                    {
                        gossipObject.instance === null ?
                        <GossipSkeleton />
                        :
                        <>
                            {
                                gossipObject.instance.list.length === 0 ? <span className={style.gossip_empty}>TA还没有写过碎语</span>:
                                <>
                                    {
                                        gossipObject.targetGossip !== null
                                        &&
                                        <GossipContent
                                            userInfo={props.userInfo} 
                                            data={gossipObject.targetGossip}
                                            gossipDataGet={gossipDataGet}
                                            requestInstance={requestInstance}
                                            foldStatus={true}
                                            targetComment={gossipObject.targetComment}
                                            handleFold={id => {
                                                return
                                                // setSelectGossipItem(selectGossipItem === id ? null:id)
                                            }}
                                            handleLike={(gossipId) => {
                                                if(props.userInfo === null) {
                                                    toast('你需要登录哦 (￣y▽,￣)╭ ')
                                                    return
                                                }
                                                const id = toast.loading('加载中...')
                                                let data = new FormData()
                                                data.append('gossipId', gossipId)
                                                likeGossip(data).then(resq => {
                                                    if(resq.code === 200) {
                                                        toast.success(resq.message, { id: id })
                                                        let [...temp] = gossipObject.instance.list
                                                        let index = temp.findIndex(item => item.id === gossipId)
                                                        temp[index].like = resq.data.status
                                                        temp[index].likes = resq.data.likes
                                                        setGossipObject({...gossipObject, list: temp})
                                                    } else if(resq.code === 0) {
                                                        toast(resq.message, { id: id })
                                                    } else {
                                                        toast.error(resq.message, { id: id })
                                                    }
                                                }).catch(err => {
                                                    toast.error(err.message, { id: id })
                                                })
                                            }}
                                            handleGossipList={() => {
                                                gossipData(gossipRequestInstance)
                                            }}
                                            reSetGossipComment={(id, num, status) => {
                                                setGossipObject(target => {
                                                    return {
                                                        ...target,
                                                        targetComment: {
                                                            ...target.targetComment,
                                                            like: status,
                                                            likes: num
                                                        }
                                                    }
                                                })
                                            }}/>
                                    }
                                    <TransitionGroup>
                                        {
                                            gossipObject.instance.list.map(item => {
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
                                                                const id = toast.loading('加载中...')
                                                                let data = new FormData()
                                                                data.append('gossipId', gossipId)
                                                                likeGossip(data).then(resq => {
                                                                    if(resq.code === 200) {
                                                                        toast.success(resq.message, { id: id })
                                                                        let [...temp] = gossipObject.instance.list
                                                                        let index = temp.findIndex(item => item.id === gossipId)
                                                                        temp[index].like = resq.data.status
                                                                        temp[index].likes = resq.data.likes
                                                                        setGossipObject({...gossipObject, list: temp})
                                                                    } else if(resq.code === 0) {
                                                                        toast(resq.message, { id: id })
                                                                    } else {
                                                                        toast.error(resq.message, { id: id })
                                                                    }
                                                                }).catch(err => {
                                                                    toast.error(err.message, { id: id })
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
                                </>
                                
                            }
                        </>
                    }
                </CSSTransition>
            </SwitchTransition>
        </div>
    )
}