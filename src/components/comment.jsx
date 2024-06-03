import React, { useState, useRef } from 'react'
//样式
import style from '../assets/scss/components/comment.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
//组件
import Avatar from './Avatar'
import AsukaPoppor from './popper'
import Collapse from '@mui/material/Collapse'
import Tinymce from './editor'
import PreviewImage from './PreviewImage'
import Svg from 'react-inlinesvg'
//方法
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Comment = ({
    foldStatus = false,
    data,
    targetId,
    userInfo,
    handleFold = () => null,
    handleLike = () => null,
    handleDelete = () => null,
    handleReply = () => null }) => {
    //hook
    const navigate = useNavigate()
    //params
    const [popperInstance, setPopperInstance] = useState({
        status: false,
        target: null
    })
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
    return (
        <div className={style.comment_box}>
            <div className={style.comment_top}>
                <div className={style.comment_top_left}>
                    <Avatar
                        src={data?.replyUser?.replyAvatar}
                        title={data?.replyUser?.replyNickName}
                        alt={data?.replyUser?.replyNickName}
                        onClick={() => { navigate(`/user/${data?.replyUser?.replyUserId}`) }}/>
                    <div className={style.vistor_info}>
                        <div>
                            <span className={targetId === data.commentId ? style.change_color_style:''}>{data?.replyUser?.replyNickName}</span>
                            { 
                                userInfo && userInfo.uid !== data.replyUser.replyUserId ?
                                <button 
                                    className={style.relply_button} 
                                    onClick={() => {
                                        handleFold(data.commentId)
                                    }} type="button">回复</button>
                                :
                                null
                            }
                            { userInfo && data?.replyUser?.replyUserId === userInfo.uid ? <button className={style.delete_button} type="button" onClick={(event) => { popperChange(event) }}>删除</button>:'' }
                        </div>
                        <span className={style.vistor_info_time}>{data.createTimeFormat}</span>
                    </div>
                </div>
                <div className={style.comment_top_right}>
                    <Svg
                        cacheRequests={true}
                        src='https://image.superarilo.icu/svg/like.svg'
                        preProcessor={code => code.replace(/fill=".*?"/g, 'fill="currentColor"')}
                        className={data.like ? style.had_liked:''}
                        width='1.1rem'
                        height='1.1rem'
                        onClick={() => { handleLike() }}/>
                    <span>{data.likes}</span>
                </div>
            </div>
            <div 
                ref={renderContentRef}
                className={`${style.comment_conten_render} ${renderHtml.render_html}`}
                dangerouslySetInnerHTML={
                    { 
                        __html: data.byReplyUser ? 
                            '<blockquote><p><span style="color: rgb(53, 152, 219);" data-mce-style="color: rgb(53, 152, 219);">' + data.byReplyUser.byReplyNickName + '</span></p></blockquote>' + data.content
                            :data.content
                    }
                } />
            <AsukaPoppor 
                open={popperInstance.status} 
                title='确定要删除评论吗？ (/▽＼)' 
                target={popperInstance.target} 
                placement='bottom' 
                onConfirm={() => { 
                    popperChange(null)
                    handleDelete()
                }} 
                onCancel={() => { popperChange(null) }}/>
            <Collapse in={foldStatus} mountOnEnter unmountOnExit>
                <Tinymce
                    userInfo={userInfo}
                    placeholder={`${'回复'}${' @' + data?.replyUser?.replyNickName}`} 
                    getContent={(content) => { 
                        if(content === null || content === undefined || content === '' || content === '<p></p>') {
                            toast('回复的内容不能为空白哦 (ง •_•)ง')
                            return
                        }
                        handleReply(content)
                    }}/>
            </Collapse>
            <PreviewImage current={renderContentRef} />
        </div>
    )
}
export default Comment