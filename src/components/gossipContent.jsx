import React, { useState, useEffect, useCallback, useRef } from 'react'
//样式
import style from '../assets/scss/components/gossipContent.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'

//组件
import Avatar from '../components/Avatar'
import WaterWave from './WaterWave'
import Tinymce from './editor'
import Collapse from '@mui/material/Collapse'
import Comment from './comment'
import CommentSkeleton from './CommentSkeleton'
import { CTransitionFade, CTransitionGroup } from '../components/Transition.jsx'
import toast from 'react-hot-toast'
import PreviewImage from './PreviewImage'
import Pagination from '../components/Pagination'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AsukaPoppor from './popper'
import Svg from 'react-inlinesvg'
//方法
import share from '../util/share/share'
import { useNavigate } from 'react-router-dom'
import { gossipCommentList, replyGossipComment, likeGossipComment, deleteGossipComment, deleteGossip } from '../util/gossip.js'
export default function GossipContent({ foldStatus = false, targetComment = null, data, userInfo,  reDataGet = () => null, handleLike = () => null, handleFold = () => null, reSetGossipComment = () => null }) {
    //hook
    const navigate = useNavigate()
    //ref
    const renderContentRef = useRef(null)
    //params
    const [popperInstance, setPopperInstance] = useState({
        status: false,
        target: null
    })
    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10,
        gossipId: data.id
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
    const gossipFunctionMenuRef = useRef(null)

    const [gossipFunctionMenuStatus, setGossipFunctionMenuStatus] = useState(false)
    const [editorSendToServerStatus, setEditorSendToServerStatus] = useState(false)
    
    //function
    const commentData = useCallback((instance) => {
        gossipCommentList({ data: instance, toast: null}).then(resq => {
            if(resq.code === 200) {
                if(targetComment) {
                    resq.data.list.splice(resq.data.list.findIndex(item => item.commentId === targetComment.commentId), 1)
                }
                setCommentObject(target => { return { ...target, list: resq.data.list, total: resq.data.total, pages: resq.data.pages, current: resq.data.current } })
            }
        }).catch(err => { })
    }, [targetComment])

    useEffect(() => {
        if(!foldStatus) return
        commentData(requestInstance)
    }, [commentData, requestInstance, foldStatus])

    const popperChange = (event) => {
        setPopperInstance({
            ...popperInstance,
            status: !popperInstance.status,
            target: event ? event.target:null
        })
    }
    return (
        <div className={style.gossip_box}>
            <div className={style.gossip_box_title}>
                <div className={style.left_info}>
                    <Avatar
                        width='2.8rem'
                        height='2.8rem'
                        src={data.avatar}
                        onClick={() => { navigate(`/user/${data.author}`) }}
                        title={data.nickName}
                        alt={data.nickName}/>
                    <div className={style.info_content}>
                        <div className={style.info_about_user}>
                            <span>{data.nickName}</span>
                            <span>{data.createTimeFormat}</span>
                        </div>
                        <span className={style.info_autograph}>{data.categoryName}</span>
                    </div>
                </div>
                <div ref={gossipFunctionMenuRef} className={style.right_function} onClick={() => { setGossipFunctionMenuStatus(true) }}>
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={1} />
                    <Svg
                        cacheRequests={true}
                        src='https://image.superarilo.icu/svg/option.svg'
                        width='1.1rem'
                        height='1.1rem'/>
                </div>
                <Menu
                    anchorEl={gossipFunctionMenuRef.current}
                    open={gossipFunctionMenuStatus}
                    autoFocus={false}
                    onClose={() => { setGossipFunctionMenuStatus(false) }}>
                        {
                            userInfo?.uid === data.author ?
                            <MenuItem
                                disableGutters={false}
                                onClick={e => {
                                    popperChange(e)
                                    }}>
                                <span className={style.menu_font}>
                                    删除
                                </span>
                            </MenuItem>
                            :
                            <MenuItem
                                disableGutters={false}
                                onClick={() => {  }}>
                                <span className={style.menu_font}>
                                    举报
                                </span>
                            </MenuItem>
                        }
                </Menu>
            </div>
            <div
                ref={renderContentRef}
                className={`${style.gossip_render_content} ${renderHtml.render_html}`}
                dangerouslySetInnerHTML={{ __html: data.content}}/>
            <div className={style.gossip_state}>
                <span>{data.likes} 个喜欢</span>
                <span>|</span>
                <span>{commentObject.list ? commentObject.total:data.comments} 条评论</span>
            </div>
            <div className={style.gossip_button}>
                <button 
                    type='button' 
                    onClick={() => {
                        handleLike(data.id)
                    }}>
                    <Svg
                        cacheRequests={true}
                        src='https://image.superarilo.icu/svg/like.svg'
                        preProcessor={code => code.replace(/fill=".*?"/g, 'fill="currentColor"')}
                        className={data.like === true && userInfo !== null ? style.gossip_liked:''}
                        width='1.1rem'
                        height='1.1rem'/>
                    喜欢
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={1} />
                </button>
                <button type='button' 
                    onClick={() => { handleFold(data.id) }}>
                    <Svg
                        cacheRequests={true}
                        src='https://image.superarilo.icu/svg/comment.svg'
                        width='1.1rem'
                        height='1.1rem'/>
                    评论
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={1} />
                </button>
                <button
                    type='button'
                    onClick={() => {
                        share({
                            title: `${data.nickName}的碎语`,
                            desc: '来自Arilo博客的碎语',
                            link: `${window.location.protocol}//${window.location.hostname}/gossip?targetId=${data.id}`,
                            icon: data.avatar
                        })
                    }}>
                    <Svg
                        cacheRequests={true}
                        src='https://image.superarilo.icu/svg/share.svg'
                        width='1.1rem'
                        height='1.1rem'/>
                    分享
                    <WaterWave
                        color="rgba(0, 0, 0, 0.7)"
                        duration={1}/>
                </button>
            </div>
            <Collapse in={foldStatus} mountOnEnter unmountOnExit timeout={300}>
                <Tinymce
                    userInfo={userInfo} 
                    ref={tinymce}
                    placeholder='发表一条友善的评论吧...'
                    status={editorSendToServerStatus}
                    getContent={value => {
                        if(value === null || value === '' || value === '<p></p>') {
                            toast('不能提交空白哦 ⊙﹏⊙∥')
                            return
                        }
                        if(!editorSendToServerStatus) {
                            setEditorSendToServerStatus(true)
                            let d = new FormData()
                            d.append('gossipId', data.id)
                            d.append('content', value)
                            replyGossipComment({ data: d, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                if(resq.code === 200) {
                                    tinymce.current.clear()
                                    commentData(requestInstance)
                                }
                                setEditorSendToServerStatus(false)
                            }).catch(() => {
                                setEditorSendToServerStatus(false)
                            })
                        }
                    }}/>
                <div className={style.gossip_comment_list}>
                    {
                        commentObject.list === null ? <CommentSkeleton />:
                        <>
                            {
                                targetComment !== null
                                &&
                                <Comment
                                    targetId={targetComment.commentId}
                                    userInfo={userInfo}
                                    foldStatus={selectCommentItem === targetComment.commentId}
                                    data={targetComment}
                                    handleLike={() => { 
                                        if(userInfo === null) {
                                            toast('你需要登陆才能继续哦 ⊙﹏⊙∥')
                                            return
                                        }
                                        let d = new FormData()
                                        d.append('gossipId', data.id)
                                        d.append('commentId', targetComment.commentId)
                                        likeGossipComment({ data: d, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                            if(resq.code === 200) {
                                                reSetGossipComment(id, resq.data.likes, resq.data.status)
                                            }
                                        }).catch(err => { })
                                    }}
                                    handleFold={(id) => {
                                        setSelectCommentItem(id === selectCommentItem ? null:id)
                                    }}
                                    handleReply={content => {
                                        let d = new FormData()
                                        d.append('gossipId', data.id)
                                        d.append('content', content)
                                        d.append('replyCommentId', targetComment.commentId)
                                        d.append('replyUserId', targetComment.replyUser.replyUserId)
                                        replyGossipComment({ data: d, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                            if(resq.code === 200) {
                                                commentData(requestInstance)
                                                setSelectCommentItem(null)
                                            }
                                        }).catch(err => {})
                                    }}
                                    handleDelete={() => {
                                        let d = new FormData()
                                        d.append('gossipId', data.id)
                                        d.append('commentId', targetComment.commentId)
                                        deleteGossipComment({ data: d, toast: { isShow: true, loadingMessage: '删除中...' } }).then(resq => {
                                            if(resq.code === 200) {
                                                commentData(requestInstance)
                                            }
                                        }).catch(err => { })
                                    }}/>
                            }
                            <CTransitionFade
                                keyS={commentObject.list.length === 0}
                                left={<div className={style.empty_box}>当前没有评论，赶快来评论吧 ψ(｀∇´)ψ</div>}
                                right={
                                    <CTransitionGroup>
                                        {
                                            commentObject.list.map(item => {
                                                return (
                                                    <Collapse key={item.commentId}>
                                                        <Comment
                                                            userInfo={userInfo} 
                                                            key={item.commentId} 
                                                            data={item}
                                                            foldStatus={selectCommentItem === item.commentId}
                                                            handleFold={(id) => { setSelectCommentItem(id === selectCommentItem ? null:id) }}
                                                            handleLike={() => { 
                                                                if(userInfo === null) {
                                                                    toast('你需要登陆才能继续哦 ⊙﹏⊙∥')
                                                                    return
                                                                }
                                                                let d = new FormData()
                                                                d.append('gossipId', data.id)
                                                                d.append('commentId', item.commentId)
                                                                likeGossipComment({ data: d, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                    if(resq.code === 200) {
                                                                        let [...temp] = commentObject.list
                                                                        let index = temp.findIndex(key => key.commentId === item.commentId)
                                                                        temp[index].like = resq.data.status
                                                                        temp[index].likes = resq.data.likes
                                                                        setCommentObject({...commentObject, list: temp})
                                                                    }
                                                                }).catch(err => {})
                                                            }}
                                                            handleReply={content => {
                                                                let d = new FormData()
                                                                d.append('gossipId', data.id)
                                                                d.append('content', content)
                                                                d.append('replyCommentId', item.commentId)
                                                                d.append('replyUserId', item.replyUser.replyUserId)
                                                                replyGossipComment({ data: d, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                    if(resq.code === 200) {
                                                                        commentData(requestInstance)
                                                                        setSelectCommentItem(null)
                                                                    }
                                                                }).catch(err => {
                                                                    setSelectCommentItem(null)
                                                                })
                                                            }}
                                                            handleDelete={() => {
                                                                let d = new FormData()
                                                                d.append('gossipId', data.id)
                                                                d.append('commentId', item.commentId)
                                                                deleteGossipComment({ data: d, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                    if(resq.code === 200) {
                                                                        commentData(requestInstance)
                                                                    }
                                                                }).catch(err => {})
                                                            }}/>
                                                    </Collapse>
                                                )
                                            })
                                        }
                                    </CTransitionGroup>
                                } />
                        </>
                    }
                    {
                        commentObject.pages === 0 || commentObject.pages === 1 ? '':
                        <Pagination 
                            count={commentObject.pages}
                            page={commentObject.current}
                            onPageChange={e => { setRequestInstance({...requestInstance, pageNum: e}) }}/>
                    }
                </div>
            </Collapse>
            <PreviewImage 
                current={renderContentRef}/>
            <AsukaPoppor 
                open={popperInstance.status} 
                title='确定要删除碎语吗？ (/▽＼)' 
                target={popperInstance.target} 
                placement='bottom' 
                onConfirm={() => { 
                    let data = new FormData()
                    data.append('gossipId', data.id)
                    deleteGossip({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                        if(resq.code === 200) {
                            popperChange(null)
                            setGossipFunctionMenuStatus(false)
                            reDataGet()
                            
                        }
                    }).catch(err => {})
                }} 
                onCancel={() => { popperChange(null) }}/>
        </div>
    )
}