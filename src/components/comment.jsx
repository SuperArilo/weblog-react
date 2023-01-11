import React, { useEffect, useState } from 'react'
//样式
import style from '../assets/scss/components/comment.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
//组件
import Avatar from './Avatar'
import AsukaPoppor from './popper'
import Collapse from '@mui/material/Collapse'
import Tinymce from './editor'
import KeepAlive from 'react-activation'
//方法
import customTips from '../util/notostack/customTips'
import ImageViewer from 'awesome-image-viewer'
import $ from 'jquery'

export default class Comment extends React.Component {
    static defaultProps = {
        foldStatus: false
    }
    state = {
        popperStatus: false,
        editorLoadingStatus: false,
        renderContentRef: React.createRef(),
        target: null
    }
    componentDidMount() {
        $(this.state.renderContentRef.current).find('img').on('click', (element) => {
            let list = []
            $(this.state.renderContentRef.current).find('img').each((index, e) => {
                list.push({ mainUrl: $(e).attr('src') })
            })
            new ImageViewer({
                images: list,
                showThumbnails: false,
                isZoomable: false,
                currentSelected: $(element.target).index()
            })
        })
    }
    userReBackComment(content) {
        if(content === null || content === undefined || content === '' || content === '<p></p>') {
            customTips.warning('回复的内容不能为空白哦 (ง •_•)ง')
            return
        }
        this.props.handleReply(content, this)
        this.setState({ editorLoadingStatus: true })
    }
    //弹出框切换
    popperChange(event) {
        this.setState({ popperStatus: !this.state.popperStatus, target: event ? event.target:null })
    }
    setStatus(status) {
        this.setState({ editorLoadingStatus: status })
    }
    closeBox() {
        this.setState({ editorLoadingStatus: false })
    }
    render() {
        return (
            <div className={style.comment_box} id={`${this.props.data.replyUser.replyUserId.toString() + this.props.data.commentId.toString()}`}>
                <div className={style.comment_top}>
                    <div className={style.comment_top_left}>
                        <Avatar src={this.props.data.replyUser.replyAvatar} title={this.props.data.replyUser.replyNickName} alt={this.props.data.replyUser.replyNickName} />
                        <div className={style.vistor_info}>
                            <div>
                                <span>{this.props.data.replyUser.replyNickName}</span>
                                { this.props.userInfo ? <button 
                                                            className={style.relply_button} 
                                                            onClick={() => {
                                                                this.props.handleFold(this.props.data.commentId)
                                                            }} type="button">回复</button>:'' }
                                { this.props.userInfo && this.props.data.replyUser.replyUserId === this.props.userInfo.uid ? <button className={style.delete_button} type="button" onClick={(event) => { this.popperChange(event) }}>删除</button>:'' }
                            </div>
                            <span className={style.vistor_info_time}>{this.props.data.createTime}</span>
                        </div>
                    </div>
                    <div className={style.comment_top_right}>
                        <i className={'fas fa-heart ' + (this.props.data.isLike ? style.had_liked:'')} onClick={() => { this.props.handleLike() }} />
                        <span>{this.props.data.likes}</span>
                    </div>
                </div>
                <div 
                    ref={this.state.renderContentRef}
                    className={`${style.comment_conten_render} ${renderHtml.render_html}`}
                    dangerouslySetInnerHTML={
                        { 
                            __html: this.props.data.byReplyUser ? 
                                '<blockquote><a title="' + this.props.data.byReplyUser.byReplyName + '" href="#' + this.props.data.byReplyUser.byReplyUserId + this.props.data.byReplyUser.byReplyCommentId + '" target="_self">@ ' + this.props.data.byReplyUser.byReplyName + '</a></blockquote>' + this.props.data.content
                                :this.props.data.content
                        }
                    } />
                <AsukaPoppor 
                    open={this.state.popperStatus} 
                    title='确定要删除评论吗？ (/▽＼)' 
                    target={this.state.target} 
                    placement='bottom-start' 
                    onConfirm={() => { 
                        this.popperChange(null)
                        this.props.handleDelete()
                    }} 
                    onCancel={() => { this.popperChange(null) }}/>
                <KeepAlive>
                    <Collapse in={this.props.foldStatus} mountOnEnter unmountOnExit>
                        <Tinymce 
                            placeholder={`${'回复'}${' @' + this.props.data.replyUser.replyNickName}`} 
                            status={this.state.editorLoadingStatus} 
                            getContent={(value) => { 
                                this.userReBackComment(value) 
                            }}/>
                    </Collapse>
                </KeepAlive>
            </div>
        )
    }
}