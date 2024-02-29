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
export default function GossipContent(props) {
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
    const gossipFunctionMenuRef = useRef(null)

    const [gossipFunctionMenuStatus, setGossipFunctionMenuStatus] = useState(false)
    const [editorSendToServerStatus, setEditorSendToServerStatus] = useState(false)
    
    //function
    const commentData = useCallback((instance) => {
        gossipCommentList({ data: instance, toast: null}).then(resq => {
            if(resq.code === 200) {
                if(props.targetComment) {
                    resq.data.list.splice(resq.data.list.findIndex(item => item.commentId === props.targetComment.commentId), 1)
                }
                setCommentObject(target => { return { ...target, list: resq.data.list, total: resq.data.total, pages: resq.data.pages, current: resq.data.current } })
            }
        }).catch(err => { })
    }, [props.targetComment])

    useEffect(() => {
        if(!props.foldStatus) return
        commentData(requestInstance)
    }, [commentData, requestInstance, props.foldStatus])

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
                        src={props.data.avatar}
                        onClick={() => { navigate(`/user/${props.data.author}`) }}
                        title={props.data.nickName}
                        alt={props.data.nickName}/>
                    <div className={style.info_content}>
                        <div className={style.info_about_user}>
                            <span>{props.data.nickName}</span>
                            <span>{props.data.createTimeFormat}</span>
                        </div>
                        <span className={style.info_autograph}>{props.data.categoryName}</span>
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
                            props.userInfo?.uid === props.data.author ?
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
                dangerouslySetInnerHTML={{ __html: props.data.content}}/>
            <div className={style.gossip_state}>
                <span>{props.data.likes} 个喜欢</span>
                <span>|</span>
                <span>{commentObject.list ? commentObject.total:props.data.comments} 条评论</span>
            </div>
            <div className={style.gossip_button}>
                <button 
                    type='button' 
                    onClick={() => {
                        props.handleLike(props.data.id)
                    }}>
                    <Svg
                        cacheRequests={true}
                        src='https://image.superarilo.icu/svg/like.svg'
                        preProcessor={code => code.replace(/fill=".*?"/g, 'fill="currentColor"')}
                        className={props.data.like === true && props.userInfo !== null ? style.gossip_liked:''}
                        width='1.1rem'
                        height='1.1rem'/>
                    喜欢
                    <WaterWave color="rgba(0, 0, 0, 0.7)" duration={1} />
                </button>
                <button type='button' 
                    onClick={() => { props.handleFold(props.data.id) }}>
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
                            title: `${props.data.nickName}的碎语`,
                            desc: '来自Arilo博客的碎语',
                            link: `${window.location.protocol}//${window.location.hostname}/gossip?targetId=${props.data.id}`,
                            icon: props.data.avatar
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
            <Collapse in={props.foldStatus} mountOnEnter unmountOnExit timeout={300}>
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
                            setEditorSendToServerStatus(true)
                            let data = new FormData()
                            data.append('gossipId', props.data.id)
                            data.append('content', value)
                            replyGossipComment({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                if(resq.code === 200) {
                                    tinymce.current.clear()
                                    commentData(requestInstance)
                                }
                                setEditorSendToServerStatus(false)
                            }).catch(() => {})
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
                                    targetId={props.targetComment.commentId}
                                    userInfo={props.userInfo}
                                    foldStatus={selectCommentItem === props.targetComment.commentId}
                                    data={props.targetComment}
                                    handleLike={() => { 
                                        if(props.userInfo === null) {
                                            toast('你需要登陆才能继续哦 ⊙﹏⊙∥')
                                            return
                                        }
                                        let data = new FormData()
                                        data.append('gossipId', props.data.id)
                                        data.append('commentId', props.targetComment.commentId)
                                        likeGossipComment({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                            if(resq.code === 200) {
                                                props.reSetGossipComment(id, resq.data.likes, resq.data.status)
                                            }
                                        }).catch(err => { })
                                    }}
                                    handleFold={(id) => {
                                        setSelectCommentItem(id === selectCommentItem ? null:id)
                                    }}
                                    handleReply={content => {
                                        let data = new FormData()
                                        data.append('gossipId', props.data.id)
                                        data.append('content', content)
                                        data.append('replyCommentId', props.targetComment.commentId)
                                        data.append('replyUserId', props.targetComment.replyUser.replyUserId)
                                        replyGossipComment({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                            if(resq.code === 200) {
                                                commentData(requestInstance)
                                                setSelectCommentItem(null)
                                            }
                                        }).catch(err => {})
                                    }}
                                    handleDelete={() => {
                                        let data = new FormData()
                                        data.append('gossipId', props.data.id)
                                        data.append('commentId', props.targetComment.commentId)
                                        deleteGossipComment({ data: data, toast: { isShow: true, loadingMessage: '删除中...' } }).then(resq => {
                                            if(resq.code === 200) {
                                                commentData(requestInstance)
                                            }
                                        }).catch(err => { })
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
                                                                    let data = new FormData()
                                                                    data.append('gossipId', props.data.id)
                                                                    data.append('commentId', item.commentId)
                                                                    likeGossipComment({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
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
                                                                    let data = new FormData()
                                                                    data.append('gossipId', props.data.id)
                                                                    data.append('content', content)
                                                                    data.append('replyCommentId', item.commentId)
                                                                    data.append('replyUserId', item.replyUser.replyUserId)
                                                                    replyGossipComment({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                        if(resq.code === 200) {
                                                                            commentData(requestInstance)
                                                                            setSelectCommentItem(null)
                                                                        }
                                                                    }).catch(err => {})
                                                                }}
                                                                handleDelete={() => {
                                                                    let data = new FormData()
                                                                    data.append('gossipId', props.data.id)
                                                                    data.append('commentId', item.commentId)
                                                                    deleteGossipComment({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                        if(resq.code === 200) {
                                                                            commentData(requestInstance)
                                                                        }
                                                                    }).catch(err => {})
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
                    data.append('gossipId', props.data.id)
                    deleteGossip({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                        if(resq.code === 200) {
                            popperChange(null)
                            setGossipFunctionMenuStatus(false)
                            props.reDataGet()
                            
                        }
                    }).catch(err => {})
                }} 
                onCancel={() => { popperChange(null) }}/>
        </div>
    )
}
GossipContent.defaultProps = {
    foldStatus: false,
    targetComment: null,
    reDataGet: () => {
        return null
    }
}