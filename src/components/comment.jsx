import React, { useEffect, useState } from 'react'
import style from '../assets/scss/components/comment.module.scss'
import customTips from '../util/notostack/customTips'
import renderHtml from '../assets/scss/renderHtml.module.scss'
export default class Comment extends React.Component {
    state = {

    }
    componentDidMount() {
    }
    render() {
        return (
            <li className={style.comment_box}>
                <div className={style.comment_top}>
                    <div className={style.comment_top_left}>
                        <img src={this.props.data.replyUser.replyAvatar} title={this.props.data.replyUser.replyNickName} alt={this.props.data.replyUser.replyNickName}/>
                        <div className={style.vistor_info}>
                            <div>
                                <span>{this.props.data.replyUser.replyNickName}</span>
                                <button className={style.relply_button} type="button">回复</button>
                                <button className={style.delete_button} type="button">删除</button>
                            </div>
                            <span className={style.vistor_info_time}>{this.props.data.createTime}</span>
                        </div>
                    </div>
                    <div className={style.comment_top_right}>
                        <i className={'fas fa-heart ' + (this.props.data.isLike ? style.had_liked:'')} />
                        <span>{this.props.data.likes}</span>
                    </div>
                </div>
                <div className={`${style.comment_conten_render} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: this.props.data.content}} />
            </li>
        )
    }
}