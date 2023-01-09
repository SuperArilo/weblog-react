import React, { useState, useEffect, useCallback } from 'react'
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
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import customTips from '../util/notostack/customTips'
//方法
import { gossipCommentList } from '../util/gossip.js'

export default class GossipContent extends React.Component {
    state = {
        editorStatus: false,
        requestInstance: {
            pageNum: 1,
            pageSize: 10,
            gossipId: this.props.data.id
        },
        commentList: null
    }
    componentDidMount() {
        
    }
    render() {
        return (
            <div className={style.gossip_box}>
                <header className={style.gossip_box_title}>
                    <div className={style.left_info}>
                        <Avatar width='2.8rem' height='2.8rem' src={this.props.data.avatar}/>
                        <div className={style.info_content}>
                            <div>
                                <span>{this.props.data.nickName}</span>
                                <span>{this.props.data.createTime}</span>
                            </div>
                            <span></span>
                        </div>
                    </div>
                    <div className={style.right_function}>
                        <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                        <i className='fas fa-ellipsis-v' />
                    </div>
                </header>
                <div className={`${style.gossip_render_content} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: this.props.data.content}} />
                <div className={style.gossip_state}>
                    <span>{this.props.data.likes} 个喜欢</span>
                    <span>|</span>
                    <span>{this.props.data.comments} 条评论</span>
                </div>
                <div className={style.gossip_button}>
                    <button type='button'>
                        <i className='fas fa-heart' />
                        喜欢
                        <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                    </button>
                    <button type='button' 
                        onClick={() => { 
                            this.setState({ editorStatus: !this.state.editorStatus })
                            gossipCommentList(this.state.requestInstance).then(resq => {
                                if(resq.code === 200) {
                                    setTimeout(() => {
                                        this.setState({ commentList: resq.data.list })
                                    }, 1000)
                                } else {
                                    customTips.error(resq.message)
                                }
                            }).catch(err => {
                                customTips.error(err.message)
                            })
                        }}>
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
                <Collapse in={this.state.editorStatus} mountOnEnter unmountOnExit>
                    <Tinymce />
                    {
                        this.state.commentList === null ? <CommentSkeleton />:this.state.commentList.length === 0 ? <span>none</span>:
                        <div className={style.gossip_comment_list}>
                            {
                                this.state.commentList.map(item => {
                                    return (
                                        <Collapse in={true} key={item.commentId}>
                                            <Comment
                                                userInfo={this.props.userInfo} 
                                                key={item.commentId} 
                                                data={item}
                                                handleLike={() => { 
                                                    
                                                }}
                                                handleReply={(content, ref) => {
                                                    
                                                }}
                                                handleDelete={() => {
                                                    
                                                }}/>
                                        </Collapse>
                                    )
                                })
                            }
                        </div>
                    }
                </Collapse>
            </div>
        )
    }
}