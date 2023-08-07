import React, { useState, useEffect, useCallback, useRef } from 'react'
//样式
import style from '../assets/scss/components/gossipContent.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
import '../assets/scss/currencyTransition.scss'

//组件
import Avatar from '../components/Avatar'
import WaterWave from './WaterWave'
import Tinymce from './editor'
import Collapse from '@mui/material/Collapse'
import Comment from './comment'
import CommentSkeleton from './CommentSkeleton'
import { SwitchTransition, CSSTransition, TransitionGroup } from 'react-transition-group'
import toast from 'react-hot-toast'
import Menu from './Menu'
import PreviewImage from './PreviewImage'
//方法

import { useNavigate } from 'react-router-dom'
import { gossipCommentList, replyGossipComment, likeGossipComment, deleteGossipComment, deleteGossip } from '../util/gossip.js'
export default function GossipContent(props) {
    //hook
    const navigate = useNavigate()
    //ref
    const renderContentRef = useRef(null)
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
    const commentRef = useRef(null)
    const gossipFunctionMenuRef = useRef(null)

    const [gossipFunctionMenuStatus, setGossipFunctionMenuStatus] = useState(false)
    const [editorSendToServerStatus, setEditorSendToServerStatus] = useState(false)
    
    //function
    const commentData = useCallback((instance) => {
        gossipCommentList(instance).then(resq => {
            if(resq.code === 200) {
                if(props.targetComment) {
                    resq.data.list.splice(resq.data.list.findIndex(item => item.commentId === props.targetComment.commentId), 1)
                }
                setCommentObject(target => { return { ...target, list: resq.data.list, total: resq.data.total, pages: resq.data.pages, current: resq.data.current } })
            } else {
                toast.error(resq.message)
            }
        }).catch(err => {
            toast.error(err.message)
        })
    }, [props.targetComment])

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
                        <div className={style.info_about_user}>
                            <span>{props.data.nickName}</span>
                            <span>{props.data.createTimeFormat}</span>
                        </div>
                        <span className={style.info_autograph}>{props.data.categoryName}</span>
                    </div>
                </div>
                {
                    props.userInfo?.uid === props.data.author &&
                    <div ref={gossipFunctionMenuRef} className={style.right_function} onClick={() => { setGossipFunctionMenuStatus(true) }}>
                        <WaterWave color="rgba(0, 0, 0, 0.7)" duration={1} />
                        <i className='fas fa-ellipsis-v' />
                    </div>
                }
                <Menu 
                    open={gossipFunctionMenuStatus}
                    targetElement={gossipFunctionMenuRef.current}
                    renderObject={[{ id: 0, title: '删除' }]}
                    onClickItem={(e) => {
                        switch(e) {
                            case 0:
                                const id = toast.loading('操作中...')
                                let data = new FormData()
                                data.append('gossipId', props.data.id)
                                deleteGossip(data).then(resq => {
                                    if(resq.code === 200) {
                                        toast.success(resq.message, { id: id })
                                        props.gossipDataGet()
                                    } else {
                                        toast.error(resq.message, { id: id })
                                    }
                                }).catch(err => {
                                    toast.error(err.message, { id: id })
                                })
                            break
                            default:
                                break
                        }
                    }}
                    onClose={() => { setGossipFunctionMenuStatus(false) }}/>
            </header>
            <div
                ref={renderContentRef}
                className={`${style.gossip_render_content} ${renderHtml.render_html}`}
                dangerouslySetInnerHTML={{ __html: props.data.content}}/>
            <div className={style.gossip_state}>
                <span>{props.data.likes} 个喜欢</span>
                <span>|</span>
                <span>{commentObject.list ? commentObject.total:props.data.comments} 条评论</span>
            </div>
            <div className={style.gossip_button}>
                <button 
                    type='button' 
                    className={`${props.data.like ? style.gossip_liked:''}`} 
                    onClick={() => {
                        props.handleLike(props.data.id)
                    }}>
                    <i className='fas fa-heart' />
                    喜欢
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={1} />
                </button>
                <button type='button' 
                    onClick={() => { props.handleFold(props.data.id) }}>
                    <i className='fas fa-comment-dots' />
                    评论
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={1} />
                </button>
                <button type='button'>
                    <i className='fas fa-share-alt' />
                    分享
                    <WaterWave
                        color="rgba(0, 0, 0, 0.7)"
                        duration={1}/>
                </button>
            </div>
            <Collapse in={props.foldStatus} mountOnEnter unmountOnExit>
                <Tinymce
                    userInfo={props.userInfo} 
                    ref={tinymce}
                    placeholder='发表一条友善的评论吧...'
                    status={editorSendToServerStatus}
                    getContent={value => {
                        if(value === null || value === '' || value === '<p></p>') {
                            toast('不能提交空白哦 ⊙﹏⊙∥')
                            return
                        }
                        if(!editorSendToServerStatus) {
                            const id = toast.loading('提交中...')
                            setEditorSendToServerStatus(true)
                            let data = new FormData()
                            data.append('gossipId', props.data.id)
                            data.append('content', value)
                            replyGossipComment(data).then(resq => {
                                if(resq.code === 200) {
                                    tinymce.current.clear()
                                    toast.success(resq.message, { id: id })
                                    commentData(requestInstance)
                                } else if(resq.code === 0) {
                                    toast(resq.message, { id: id })
                                } else {
                                    toast.error(resq.message, { id: id })
                                }
                                setEditorSendToServerStatus(false)
                            })
                        }
                    }}/>
                <div className={style.gossip_comment_list}>
                    {
                        commentObject.list === null ? <CommentSkeleton />:
                        <>
                            {
                                props.targetComment !== null
                                &&
                                <Comment
                                    ref={commentRef}
                                    targetId={props.targetComment.commentId}
                                    userInfo={props.userInfo}
                                    foldStatus={selectCommentItem === props.targetComment.commentId}
                                    data={props.targetComment}
                                    handleLike={() => { 
                                        if(props.userInfo === null) {
                                            toast('你需要登陆才能继续哦 ⊙﹏⊙∥')
                                            return
                                        }
                                        const id = toast.loading('提交中...')
                                        let data = new FormData()
                                        data.append('gossipId', props.data.id)
                                        data.append('commentId', props.targetComment.commentId)
                                        likeGossipComment(data).then(resq => {
                                            if(resq.code === 200) {
                                                props.reSetGossipComment(id, resq.data.likes, resq.data.status)
                                                toast.success(resq.message, { id: id })
                                            } else if(resq.code === 0) {
                                                toast(resq.message, { id: id })
                                            } else {
                                                toast.error(resq.message, { id: id })
                                            }
                                        }).catch(err => {
                                            toast.error(err.message, { id: id })
                                        })
                                    }}
                                    handleFold={(id) => {
                                        setSelectCommentItem(id === selectCommentItem ? null:id)
                                    }}
                                    handleReply={content => {
                                        const id = toast.loading('提交中...')
                                        let data = new FormData()
                                        data.append('gossipId', props.data.id)
                                        data.append('content', content)
                                        data.append('replyCommentId', props.targetComment.commentId)
                                        data.append('replyUserId', props.targetComment.replyUser.replyUserId)
                                        replyGossipComment(data).then(resq => {
                                            if(resq.code === 200) {
                                                toast.success(resq.message, { id: id })
                                                commentData(requestInstance)
                                                setSelectCommentItem(null)
                                            } else if(resq.code === 0) {
                                                toast(resq.message, { id: id })
                                            } else {
                                                toast.error(resq.message, { id: id })
                                            }
                                            commentRef.current.changeEditorLoadingStatus(false)
                                        }).catch(err => {
                                            toast.error(err.message, { id: id })
                                            commentRef.current.changeEditorLoadingStatus(false)
                                        })
                                    }}
                                    handleDelete={() => {
                                        const id = toast.loading('提交中...')
                                        let data = new FormData()
                                        data.append('gossipId', props.data.id)
                                        data.append('commentId', props.targetComment.commentId)
                                        deleteGossipComment(data).then(resq => {
                                            if(resq.code === 200) {
                                                toast.success(resq.message, { id: id })
                                                commentData(requestInstance)
                                            } else if(resq.code === 0) {
                                                toast(resq.message, { id: id })
                                            } else {
                                                toast.error(resq.message, { id: id })
                                            }
                                        }).catch(err => {
                                            toast.error(err.message, { id: id })
                                        })
                                    }}/>
                            }
                            <SwitchTransition mode='out-in'>
                                <CSSTransition key={commentObject.list.length === 0} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                                    {
                                        commentObject.list.length === 0 ? <div className={style.empty_box}>当前没有评论，赶快来评论吧 ψ(｀∇´)ψ</div>:
                                        <TransitionGroup>
                                            {
                                                commentObject.list.map(item => {
                                                    return (
                                                        <Collapse key={item.commentId}>
                                                            <Comment
                                                                ref={commentRef}
                                                                userInfo={props.userInfo} 
                                                                key={item.commentId} 
                                                                data={item}
                                                                foldStatus={selectCommentItem === item.commentId}
                                                                handleFold={(id) => { setSelectCommentItem(id === selectCommentItem ? null:id) }}
                                                                handleLike={() => { 
                                                                    if(props.userInfo === null) {
                                                                        toast('你需要登陆才能继续哦 ⊙﹏⊙∥')
                                                                        return
                                                                    }
                                                                    const id = toast.loading('提交中...')
                                                                    let data = new FormData()
                                                                    data.append('gossipId', props.data.id)
                                                                    data.append('commentId', item.commentId)
                                                                    likeGossipComment(data).then(resq => {
                                                                        if(resq.code === 200) {
                                                                            toast.success(resq.message, { id: id })
                                                                            let [...temp] = commentObject.list
                                                                            let index = temp.findIndex(key => key.commentId === item.commentId)
                                                                            temp[index].like = resq.data.status
                                                                            temp[index].likes = resq.data.likes
                                                                            setCommentObject({...commentObject, list: temp})
                                                                        } else if(resq.code === 0) {
                                                                            toast(resq.message, { id: id })
                                                                        } else {
                                                                            toast.error(resq.message, { id: id })
                                                                        }
                                                                    }).catch(err => {
                                                                        toast.error(err.message, { id: id })
                                                                    })
                                                                }}
                                                                handleReply={content => {
                                                                    const id = toast.loading('提交中...')
                                                                    let data = new FormData()
                                                                    data.append('gossipId', props.data.id)
                                                                    data.append('content', content)
                                                                    data.append('replyCommentId', item.commentId)
                                                                    data.append('replyUserId', item.replyUser.replyUserId)
                                                                    replyGossipComment(data).then(resq => {
                                                                        if(resq.code === 200) {
                                                                            toast.success(resq.message, { id: id })
                                                                            commentData(requestInstance)
                                                                            setSelectCommentItem(null)
                                                                        } else if(resq.code === 0) {
                                                                            toast(resq.message, { id: id })
                                                                        } else {
                                                                            toast.error(resq.message, { id: id })
                                                                        }
                                                                        commentRef.current.changeEditorLoadingStatus(false)
                                                                    }).catch(err => {
                                                                        toast.error(err.message, { id: id })
                                                                        commentRef.current.changeEditorLoadingStatus(false)
                                                                    })
                                                                }}
                                                                handleDelete={() => {
                                                                    const id = toast.loading('提交中...')
                                                                    let data = new FormData()
                                                                    data.append('gossipId', props.data.id)
                                                                    data.append('commentId', item.commentId)
                                                                    deleteGossipComment(data).then(resq => {
                                                                        if(resq.code === 200) {
                                                                            toast.success(resq.message, { id: id })
                                                                            commentData(requestInstance)
                                                                        } else if(resq.code === 0) {
                                                                            toast(resq.message, { id: id })
                                                                        } else {
                                                                            toast.error(resq.message, { id: id })
                                                                        }
                                                                    }).catch(err => {
                                                                        toast.error(err.message, { id: id })
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
                        </>
                        
                    }
                    {/* {
                        commentObject.pages === 0 || commentObject.pages === 1 ? '':
                        <Pagination 
                            total={commentObject.total}
                            current={commentObject.current}
                            onPageChange={e => { setRequestInstance({...requestInstance, pageNum: e}) }}/>
                    } */}
                </div>
            </Collapse>
            <PreviewImage 
                current={renderContentRef}/>
        </div>
    )
}
GossipContent.defaultProps = {
    foldStatus: false,
    targetComment: null
}