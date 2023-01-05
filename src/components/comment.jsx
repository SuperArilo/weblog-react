import React, { useEffect, useState } from 'react'
//样式
import style from '../assets/scss/components/comment.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
//组件
import Avatar from './Avatar'
import AsukaPoppor from './popper'
import Collapse from '@mui/material/Collapse';
import Tinymce from './editor'
//方法
import customTips from '../util/notostack/customTips'
import { replyComment, likeComment, deleteComment } from '../util/article'

export default class Comment extends React.Component {
    state = {
        popperStatus: false,
        commentRebackBoxStatus: false,
        commentRebackStatus: false,
        tinymce: React.createRef(),
        target: null,
        deleteCommentStatus: false,
    }
    componentDidMount() {
        
    }
    userLikeComment() {
        if(this.props.userInfo === null) {
            customTips.info('你需要登陆才能继续哦 ⊙﹏⊙∥')
            return
        }
        let data = new FormData()
        data.append('articleId', this.props.articleId)
        data.append('commentId', this.props.data.commentId)
        likeComment(data).then(resq => {
            if(resq.code === 200) {
                customTips.success(resq.message)
                this.props.likeStatusChange({ commentId: this.props.data.commentId, status: resq.data.status })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }
    userDeleteComment() {
        if(!this.state.deleteCommentStatus) {
            this.setState({ deleteCommentStatus: true })
            let data = new FormData()
            data.append('articleId', this.props.articleId)
            data.append('commentId', this.props.data.commentId)
            deleteComment(data).then(resq => {
                if(resq.code === 200) {
                    customTips.success(resq.message)
                    setTimeout(() => {
                        this.props.deleteComment(this.props.data.commentId)
                    }, 500)
                } else {
                    customTips.error(resq.message)
                }
                this.setState({ deleteCommentStatus: false })
                this.popperChange(null)
            }).catch(err => {
                customTips.error(err.message)
                this.popperChange(null)
                this.setState({ deleteCommentStatus: false })
                
            })
        }
    }
    userReBackComment(content) {
        if(content === null || content === undefined || content === '' || content === '<p></p>') {
            customTips.warning('回复的内容不能为空白哦 (ง •_•)ง')
            return
        }
        if(!this.state.commentRebackStatus) {
            this.setState({ commentRebackStatus: true })
            let data = new FormData()
            data.append('articleId', this.props.articleId)
            data.append('content', content)
            data.append('replyCommentId', this.props.data.commentId)
            data.append('replyUserId', this.props.data.replyUser.replyUserId)
            replyComment(data).then(resq => {
                if(resq.code === 200) {
                    customTips.success(resq.message)
                    this.props.parentRef.commentListGet()
                    this.state.tinymce.current.clear()
                } else {
                    customTips.error(resq.message)
                }
                this.setState({ commentRebackStatus: false })
            }).catch(err => {
                customTips.error(err.message)
                this.setState({ commentRebackStatus: false })
            })
        }
    }
    //弹出框切换
    popperChange(event) {
        this.setState({
            popperStatus: !this.state.popperStatus,
            target: event ? event.target:null
        })
    }
    render() {
        return (
            <div className={style.comment_box}>
                <div className={style.comment_top}>
                    <div className={style.comment_top_left}>
                        <Avatar src={this.props.data.replyUser.replyAvatar} title={this.props.data.replyUser.replyNickName} alt={this.props.data.replyUser.replyNickName} />
                        <div className={style.vistor_info}>
                            <div>
                                <span>{this.props.data.replyUser.replyNickName}</span>
                                { this.props.userInfo ? <button className={style.relply_button} onClick={() => { this.setState({ commentRebackBoxStatus: !this.state.commentRebackBoxStatus }) }} type="button">回复</button>:'' }
                                { this.props.userInfo && this.props.data.replyUser.replyUserId === this.props.userInfo.uid ? <button className={style.delete_button} type="button" onClick={(event) => { this.popperChange(event) }}>删除</button>:'' }
                            </div>
                            <span className={style.vistor_info_time}>{this.props.data.createTime}</span>
                        </div>
                    </div>
                    <div className={style.comment_top_right}>
                        <i className={'fas fa-heart ' + (this.props.data.isLike ? style.had_liked:'')} onClick={() => { this.userLikeComment() }} />
                        <span>{this.props.data.likes}</span>
                    </div>
                </div>
                <div className={`${style.comment_conten_render} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: this.props.data.content}} />
                <AsukaPoppor open={this.state.popperStatus} title='确定要删除评论吗？ (/▽＼)' target={this.state.target} placement='bottom-start' onConfirm={() => { this.userDeleteComment() }} onCancel={() => { this.popperChange(null) }}/>
                <Collapse in={this.state.commentRebackBoxStatus} mountOnEnter unmountOnExit>
                    <Tinymce ref={this.state.tinymce} editorSetupStatus={(status) => { console.log(status) }} placeholder={`${'回复'}${' @' + this.props.data.replyUser.replyNickName}`} status={this.state.commentRebackStatus} getContent={(value) => { this.userReBackComment(value) }}/>
                </Collapse>
            </div>
        )
    }
}