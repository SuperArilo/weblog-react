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
import { gossipListRequest , likeGossip } from '../util/gossip'
import toast from 'react-hot-toast'
//hook
import { useLocation  } from "react-router-dom"
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
        gossipListRequest({ data: instance, toast: null }).then(resq => {
            if(resq.code === 200) {
                if(resq.data.targetGossip) {
                    resq.data.instance.list.splice(resq.data.instance.list.findIndex(item => item.id === resq.data.targetGossip.id), 1)
                    setSelectGossipItem(resq.data.targetGossip.id)
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
        }).catch(err => { })
    }, [])

    useEffect(() => {
        gossipDataGet(requestInstance)        
    }, [requestInstance, gossipDataGet])

    return (
        <div className={style.gossip_page} style={{ paddingTop: requestInstance.viewUid ? null:'1rem', minHeight: requestInstance.viewUid ? null:'83vh' }}>
            <SwitchTransition mode='out-in'>
                <CSSTransition key={gossipObject.instance === null} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                    {
                        gossipObject.instance === null ?
                        <GossipSkeleton viewUid={requestInstance.viewUid}/>
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
                                            reDataGet={() => {
                                                gossipDataGet()
                                            }}
                                            requestInstance={requestInstance}
                                            foldStatus={(selectGossipItem === gossipObject.targetGossip.id) && gossipObject.targetComment !== null}
                                            targetComment={gossipObject.targetComment}
                                            handleFold={id => {
                                                console.log(id)
                                                setSelectGossipItem(selectGossipItem === id ? null:id)
                                            }}
                                            handleLike={gossipId => {
                                                if(props.userInfo === null) {
                                                    toast('你需要登录哦 (￣y▽,￣)╭ ')
                                                    return
                                                }
                                                let data = new FormData()
                                                data.append('gossipId', gossipId)
                                                likeGossip({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                    if(resq.code === 200) {
                                                        let [...temp] = gossipObject.instance.list
                                                        let index = temp.findIndex(item => item.id === gossipId)
                                                        temp[index].like = resq.data.status
                                                        temp[index].likes = resq.data.likes
                                                        setGossipObject({...gossipObject, list: temp})
                                                    }
                                                }).catch(err => { })
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
                                                            reDataGet={() => {
                                                                gossipDataGet()
                                                            }}
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
                                                                let data = new FormData()
                                                                data.append('gossipId', gossipId)
                                                                likeGossip({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                    if(resq.code === 200) {
                                                                        let [...temp] = gossipObject.instance.list
                                                                        let index = temp.findIndex(item => item.id === gossipId)
                                                                        temp[index].like = resq.data.status
                                                                        temp[index].likes = resq.data.likes
                                                                        setGossipObject({...gossipObject, list: temp})
                                                                    }
                                                                }).catch(err => { })
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