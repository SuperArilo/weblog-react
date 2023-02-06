import React, { useState, useEffect, useCallback, useRef } from 'react'
//样式
import style from '../assets/scss/components/gossipContent.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
//组件
import Avatar from '../components/Avatar'
import WaterWave from 'water-wave'
import Tinymce from './editor'
import Collapse from '@mui/material/Collapse'
import Comment from './comment'
import CommentSkeleton from './CommentSkeleton'
import { SwitchTransition, CSSTransition, TransitionGroup } from 'react-transition-group'
import customTips from '../util/notostack/customTips'
import Pagination from './Pagination'
//方法
import { useNavigate } from 'react-router-dom'
import { gossipCommentList, replyGossipComment, likeGossipComment, deleteGossipComment } from '../util/gossip.js'
export default function GossipContent(props) {
    //hook
    const navigate = useNavigate()
    //params
    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10,
        gossipId: props.data.id
    })
    const [commentObject, setCommentObject] = useState({
        pages: 0,
        total: 0,
        current: 1,
        list: null
    })
    const [selectCommentItem, setSelectCommentItem] = useState(null)
    //编辑器ref
    const tinymce = useRef(null)
    const [editorSendToServerStatus, setEditorSendToServerStatus] = useState(false)
    //function
    const commentData = useCallback((instance) => {
        gossipCommentList(instance).then(resq => {
            if(resq.code === 200) {
                setCommentObject(target => { return { ...target, list: resq.data.list, total: resq.data.total, pages: resq.data.pages, current: resq.data.current } })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }, [])

    useEffect(() => {
        if(!props.foldStatus) return
        commentData(requestInstance)
    }, [commentData, requestInstance, props.foldStatus])

    return (
        <div className={style.gossip_box}>
            <header className={style.gossip_box_title}>
                <div className={style.left_info}>
                    <Avatar
                        width='2.8rem'
                        height='2.8rem'
                        src={props.data.avatar}
                        onClick={() => { navigate(`/user/${props.data.author}`) }}/>
                    <div className={style.info_content}>
                        <div>
                            <span>{props.data.nickName}</span>
                            <span>{props.data.createTime}</span>
                        </div>
                        <span></span>
                    </div>
                </div>
                <div className={style.right_function}>
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                    <i className='fas fa-ellipsis-v' />
                </div>
            </header>
            <div className={`${style.gossip_render_content} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: props.data.content}} />
            <div className={style.gossip_state}>
                <span>{props.data.likes} 个喜欢</span>
                <span>|</span>
                <span>{commentObject.list ? commentObject.total:props.data.comments} 条评论</span>
            </div>
            <div className={style.gossip_button}>
                <button 
                    type='button' 
                    className={`${props.data.isLike ? style.gossip_liked:''}`} 
                    onClick={() => { props.handleLike(props.data.id)
                    }}>
                    <i className='fas fa-heart' />
                    喜欢
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                </button>
                <button type='button' 
                    onClick={() => { props.handleFold(props.data.id) }}>
                    <i className='fas fa-comment-dots' />
                    评论
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                </button>
                <button type='button'>
                    <i className='fas fa-share-alt' />
                    分享
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                </button>
            </div>
            <Collapse in={props.foldStatus} mountOnEnter unmountOnExit>
                <Tinymce
                    ref={tinymce}
                    placeholder='发表一条友善的评论吧...'
                    status={editorSendToServerStatus}
                    getContent={(value) => { 
                        if(value === null || value === '' || value === '<p></p>') {
                            customTips.warning('不能提交空白哦 ⊙﹏⊙∥')
                            return
                        }
                        if(!editorSendToServerStatus) {
                            setEditorSendToServerStatus(true)
                            let data = new FormData()
                            data.append('gossipId', props.data.id)
                            data.append('content', value)
                            replyGossipComment(data).then(resq => {
                                if(resq.code === 200) {
                                    tinymce.current.clear()
                                    customTips.success(resq.message)
                                    commentData(requestInstance)
                                } else {
                                    customTips.error(resq.message)
                                }
                                setEditorSendToServerStatus(false)
                            }).catch(err => {
                                customTips.error(err.message)
                                setEditorSendToServerStatus(false)
                            })
                        }
                    }}/>
                {
                    commentObject.list === null ? <CommentSkeleton />:
                    <div className={style.gossip_comment_list}>
                        <SwitchTransition mode='out-in'>
                            <CSSTransition key={commentObject.list.length === 0} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                                {
                                    commentObject.list.length === 0 ? <div className={style.empty_box}>当前没有评论，赶快来评论吧 ψ(｀∇´)ψ</div>:
                                    <TransitionGroup>
                                        {
                                            commentObject.list.map(item => {
                                                return (
                                                    <Collapse in={true} key={item.commentId}>
                                                        <Comment
                                                            userInfo={props.userInfo} 
                                                            key={item.commentId} 
                                                            data={item}
                                                            foldStatus={selectCommentItem === item.commentId}
                                                            handleFold={(id) => { setSelectCommentItem(id === selectCommentItem ? null:id) }}
                                                            handleLike={() => { 
                                                                if(props.userInfo === null) {
                                                                    customTips.info('你需要登陆才能继续哦 ⊙﹏⊙∥')
                                                                    return
                                                                }
                                                                let data = new FormData()
                                                                data.append('gossipId', props.data.id)
                                                                data.append('commentId', item.commentId)
                                                                likeGossipComment(data).then(resq => {
                                                                    if(resq.code === 200) {
                                                                        customTips.success(resq.message)
                                                                        let [...temp] = commentObject.list
                                                                        let index = temp.findIndex(key => key.commentId === item.commentId)
                                                                        temp[index].isLike = resq.data.status
                                                                        temp[index].likes = resq.data.likes
                                                                        setCommentObject({...commentObject, list: temp})
                                                                    } else {
                                                                        customTips.error(resq.message)
                                                                    }
                                                                }).catch(err => {
                                                                    customTips.error(err.message)
                                                                })
                                                            }}
                                                            handleReply={(content, ref) => {
                                                                let data = new FormData()
                                                                data.append('gossipId', props.data.id)
                                                                data.append('content', content)
                                                                data.append('replyCommentId', item.commentId)
                                                                data.append('replyUserId', item.replyUser.replyUserId)
                                                                replyGossipComment(data).then(resq => {
                                                                    if(resq.code === 200) {
                                                                        customTips.success(resq.message)
                                                                        commentData(requestInstance)
                                                                        ref.closeBox()
                                                                        setSelectCommentItem(null)
                                                                    } else {
                                                                        customTips.error(resq.message)
                                                                    }
                                                                }).catch(err => {
                                                                    ref.setStatus(false)
                                                                    customTips.error(err.message)
                                                                })
                                                            }}
                                                            handleDelete={() => {
                                                                let data = new FormData()
                                                                data.append('gossipId', props.data.id)
                                                                data.append('commentId', item.commentId)
                                                                deleteGossipComment(data).then(resq => {
                                                                    if(resq.code === 200) {
                                                                        customTips.success(resq.message)
                                                                        commentData(requestInstance)
                                                                    } else {
                                                                        customTips.error(resq.message)
                                                                    }
                                                                }).catch(err => {
                                                                    customTips.error(err.message)
                                                                })
                                                            }}/>
                                                    </Collapse>
                                                )
                                            })
                                        }
                                    </TransitionGroup>
                                }
                            </CSSTransition>
                        </SwitchTransition>
                        {
                            commentObject.pages === 0 || commentObject.pages === 1 ? '':
                            <Pagination 
                                total={commentObject.total}
                                current={commentObject.current}
                                onPageChange={e => { setRequestInstance({...requestInstance, pageNum: e}) }}/>
                        }
                        
                    </div>
                }
            </Collapse>
        </div>
    )
}
GossipContent.defaultProps = {
    foldStatus: false
}