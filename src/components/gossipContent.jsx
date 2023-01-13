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
import { SwitchTransition, CSSTransition, TransitionGroup } from 'react-transition-group'
import customTips from '../util/notostack/customTips'
//方法
import { gossipCommentList, likeGossip, replyGossipComment, likeGossipComment, deleteGossipComment } from '../util/gossip.js'

export default class GossipContent extends React.Component {
    state = {
        editorStatus: false,
        requestInstance: {
            pageNum: 1,
            pageSize: 10,
            gossipId: this.props.data.id
        },
        selectCommentItem: null,
        commentList: null,
        //编辑器ref
        editorSendToServerStatus: false,
        tinymce: React.createRef()
    }
    componentDidMount() {
    }
    commentListGet() {
        gossipCommentList(this.state.requestInstance).then(resq => {
            if(resq.code === 200) {
                this.setState({ commentList: resq.data.list })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
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
                    <span>{this.state.commentList ? this.state.commentList.length:this.props.data.comments} 条评论</span>
                </div>
                <div className={style.gossip_button}>
                    <button 
                        type='button' 
                        className={`${this.props.data.isLike ? style.gossip_liked:''}`} 
                        onClick={() => { this.props.handleLike(this.props.data.id)
                        }}>
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
                    <Tinymce
                        ref={this.state.tinymce}
                        placeholder='发表一条友善的评论吧...'
                        status={this.state.editorSendToServerStatus}
                        getContent={(value) => { 
                            if(value === null || value === '' || value === '<p></p>') {
                                customTips.warning('不能提交空白哦 ⊙﹏⊙∥')
                                return
                            }
                            if(!this.state.editorSendToServerStatus) {
                                this.setState({ editorSendToServerStatus: true })
                                let data = new FormData()
                                data.append('gossipId', this.props.data.id)
                                data.append('content', value)
                                replyGossipComment(data).then(resq => {
                                    if(resq.code === 200) {
                                        this.state.tinymce.current.clear()
                                        customTips.success(resq.message)
                                        this.commentListGet()
                                    } else {
                                        customTips.error(resq.message)
                                    }
                                    this.setState({ editorSendToServerStatus: false })
                                }).catch(err => {
                                    customTips.error(err.message)
                                    this.setState({ editorSendToServerStatus: false })
                                })
                            }
                        }}/>
                    {
                        this.state.commentList === null ? <CommentSkeleton />:
                        <div className={style.gossip_comment_list}>
                            <SwitchTransition mode='out-in'>
                                <CSSTransition key={this.state.commentList.length === 0 ? true:false} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                                    {
                                        this.state.commentList.length === 0 ? <div className={style.empty_box}>当前没有评论，赶快来评论吧 ψ(｀∇´)ψ</div>:
                                        <TransitionGroup>
                                            {
                                                this.state.commentList.map(item => {
                                                    return (
                                                        <Collapse in={true} key={item.commentId}>
                                                            <Comment
                                                                userInfo={this.props.userInfo} 
                                                                key={item.commentId} 
                                                                data={item}
                                                                foldStatus={this.state.selectCommentItem === item.commentId}
                                                                handleFold={(id) => {
                                                                    if(this.state.selectCommentItem === id) {
                                                                        this.setState({ selectCommentItem: null })
                                                                    } else {
                                                                        this.setState({ selectCommentItem: id })
                                                                    }
                                                                }}
                                                                handleLike={() => { 
                                                                    if(this.props.userInfo === null) {
                                                                        customTips.info('你需要登陆才能继续哦 ⊙﹏⊙∥')
                                                                        return
                                                                    }
                                                                    let data = new FormData()
                                                                    data.append('gossipId', this.props.data.id)
                                                                    data.append('commentId', item.commentId)
                                                                    likeGossipComment(data).then(resq => {
                                                                        if(resq.code === 200) {
                                                                            customTips.success(resq.message)
                                                                            let [...temp] = this.state.commentList
                                                                            let index = temp.findIndex(key => key.commentId === item.commentId)
                                                                            temp[index].isLike = resq.data.status
                                                                            temp[index].likes = resq.data.likes
                                                                            this.setState({ commentList: temp })
                                                                        } else {
                                                                            customTips.error(resq.message)
                                                                        }
                                                                    }).catch(err => {
                                                                        customTips.error(err.message)
                                                                    })
                                                                }}
                                                                handleReply={(content, ref) => {
                                                                    let data = new FormData()
                                                                    data.append('gossipId', this.props.data.id)
                                                                    data.append('content', content)
                                                                    data.append('replyCommentId', item.commentId)
                                                                    data.append('replyUserId', item.replyUser.replyUserId)
                                                                    replyGossipComment(data).then(resq => {
                                                                        if(resq.code === 200) {
                                                                            customTips.success(resq.message)
                                                                            this.commentListGet()
                                                                            ref.closeBox()
                                                                            this.setState({ selectCommentItem: null })
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
                                                                    data.append('gossipId', this.props.data.id)
                                                                    data.append('commentId', item.commentId)
                                                                    deleteGossipComment(data).then(resq => {
                                                                        if(resq.code === 200) {
                                                                            customTips.success(resq.message)
                                                                            this.commentListGet()
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
                        </div>
                    }
                </Collapse>
            </div>
        )
    }
}