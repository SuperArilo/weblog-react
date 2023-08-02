import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
//样式
import style from '../assets/scss/components/comment.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
//组件
import Avatar from './Avatar'
import AsukaPoppor from './popper'
import Collapse from '@mui/material/Collapse'
import Tinymce from './editor'
import PreviewImage from './PreviewImage'
//方法
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Comment = forwardRef((props, ref) => {
    //hook
    const navigate = useNavigate()
    //params
    const [popperInstance, setPopperInstance] = useState({
        status: false,
        target: null
    })
    const [editorLoadingStatus, setEditorLoadingStatus] = useState(false)
    const renderContentRef = useRef(null)
    //function

    const popperChange = (event) => {
        setPopperInstance(
            {
                ...popperInstance,
                status: !popperInstance.status,
                target: event ? event.target:null
            }
        )
    }

    useImperativeHandle(ref, () => ({
        changeEditorLoadingStatus: (status) => {
            setEditorLoadingStatus(status)
        }
    }))
    return (
        <div className={style.comment_box} id={`${props.data?.replyUser?.replyUserId.toString() + props.data.commentId.toString()}`}>
            <div className={style.comment_top}>
                <div className={style.comment_top_left}>
                    <Avatar
                        src={props.data?.replyUser?.replyAvatar}
                        title={props.data?.replyUser?.replyNickName}
                        alt={props.data?.replyUser?.replyNickName}
                        onClick={() => { navigate(`/user/${props.data?.replyUser?.replyUserId}`) }}/>
                    <div className={style.vistor_info}>
                        <div>
                            <span className={props.targetId === props.data.commentId ? style.change_color_style:''}>{props.data?.replyUser?.replyNickName}</span>
                            { 
                                props.userInfo && props.userInfo.uid !== props.data.replyUser.replyUserId ?
                                <button 
                                    className={style.relply_button} 
                                    onClick={() => {
                                        props.handleFold(props.data.commentId)
                                    }} type="button">回复</button>
                                :
                                null
                            }
                            { props.userInfo && props.data?.replyUser?.replyUserId === props.userInfo.uid ? <button className={style.delete_button} type="button" onClick={(event) => { popperChange(event) }}>删除</button>:'' }
                        </div>
                        <span className={style.vistor_info_time}>{props.data.createTimeFormat}</span>
                    </div>
                </div>
                <div className={style.comment_top_right}>
                    <i className={'fas fa-heart ' + (props.data.like ? style.had_liked:'')} onClick={() => { props.handleLike() }} />
                    <span>{props.data.likes}</span>
                </div>
            </div>
            <div 
                ref={renderContentRef}
                className={`${style.comment_conten_render} ${renderHtml.render_html}`}
                dangerouslySetInnerHTML={
                    { 
                        __html: props.data.byReplyUser ? 
                            '<blockquote><p><span style="color: rgb(53, 152, 219);" data-mce-style="color: rgb(53, 152, 219);">' + props.data.byReplyUser.byReplyNickName + '</span></p></blockquote>' + props.data.content
                            :props.data.content
                    }
                } />
            <AsukaPoppor 
                open={popperInstance.status} 
                title='确定要删除评论吗？ (/▽＼)' 
                target={popperInstance.target} 
                placement='bottom' 
                onConfirm={() => { 
                    popperChange(null)
                    props.handleDelete()
                }} 
                onCancel={() => { popperChange(null) }}/>
            <Collapse in={props.foldStatus} mountOnEnter unmountOnExit>
                <Tinymce
                    userInfo={props.userInfo}
                    placeholder={`${'回复'}${' @' + props.data?.replyUser?.replyNickName}`} 
                    status={editorLoadingStatus} 
                    getContent={(content) => { 
                        if(content === null || content === undefined || content === '' || content === '<p></p>') {
                            toast('回复的内容不能为空白哦 (ง •_•)ง')
                            return
                        }
                        props.handleReply(content)
                        setEditorLoadingStatus(true)
                    }}/>
            </Collapse>
            <PreviewImage current={renderContentRef} />
        </div>
    )
})
Comment.defaultProps = {
    foldStatus: false,
    commentId: null
}
export default Comment