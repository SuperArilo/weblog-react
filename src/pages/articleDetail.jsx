import { TransitionGroup, SwitchTransition, CSSTransition } from 'react-transition-group'
//hook
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
//样式
import style from '../assets/scss/articleDetail.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
import '../assets/scss/currencyTransition.scss'
//组件
import Tinymce from '../components/editor'
import customTips from '../util/notostack/customTips'
import Skeleton from '@mui/material/Skeleton'
import Comment from '../components/comment'
import WaterWave from 'water-wave'
import Collapse from '@mui/material/Collapse'
import Avatar from '../components/Avatar'
import CommentSkeleton from '../components/CommentSkeleton'
//方法
import { articleContentGet, articleCommentGet, replyComment, increaseArticleLike, likeComment, deleteComment } from '../util/article'
import ImageViewer from 'awesome-image-viewer'
import $ from 'jquery'
const ArticleDetail = (props) => {
    //hook
    const [ searchParams, setSearchParams] = useSearchParams()
    const articleId = searchParams.get('threadId')
    //Params
    const [addCommentStatus, setAddCommentStatus] = useState(false)
    const [articleListRef, setArticleListRef] = useState(null)
    const tinymce = useRef(null)
    const [artContentStatus, setArtContentStatus] = useState(false)
    //function
    return (
        <div className={style.article_detail}>
            <div className={style.article_detail_content}>
                <ArticleInfoTop articleId={articleId} artContent={(value) => { setArtContentStatus(value) }} />
                <Tinymce 
                    ref={tinymce} 
                    placeholder='发表一条友善的评论吧...' 
                    status={addCommentStatus} 
                    getContent={(value) => { 
                        if(value === null || value === '' || value === '<p></p>') {
                            customTips.warning('不能提交空白哦 ⊙﹏⊙∥')
                            return
                        }
                        if(!addCommentStatus) {
                            setAddCommentStatus(true)
                            let data = new FormData()
                            data.append('articleId', articleId)
                            data.append('content', value)
                            replyComment(data).then(resq => {
                                if(resq.code === 200) {
                                    tinymce.current.clear()
                                    customTips.success(resq.message)
                                    articleListRef.commentListGet()
                                } else {
                                    customTips.error(resq.message)
                                }
                                setAddCommentStatus(false)
                            }).catch(err => {
                                customTips.error(err.message)
                                setAddCommentStatus(false)
                            })
                        }
                    }}/>
                <span className={style.article_vistor_title}>评论</span>
                <ArticleVistorList childrenRef={(ref) => { setArticleListRef(ref) }} articleId={articleId} userInfo={props.userInfo} />
            </div>
        </div>
    )
}
class ArticleInfoTop extends React.Component {
    state = {
        articleInstance: ''
    }
    componentDidMount(){
        articleContentGet({ 'articleId': this.props.articleId }).then(resq => {
            if(resq.code === 200) {
                this.setState({ articleInstance: resq.data }, () => {
                    this.props.artContent(true)
                })
            } else {
                customTips.error(resq.message)
                this.props.artContent(false)
            }
        }).catch(err => {
            customTips.error(err.message)
            this.props.artContent(false)
        })
    }
    render() {
        return (
            <SwitchTransition mode='out-in'>
                <CSSTransition key={this.state.articleInstance  === ''} timeout={300} classNames="change" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                    {
                        this.state.articleInstance  === '' ? <ArticleSkeleton />:<ArticleContent 
                        articleInstance={this.state.articleInstance} 
                        handleLike={(articleId) => { 
                            let data = new FormData()
                            data.append('articleId', articleId)
                            increaseArticleLike(data).then(resq => {
                                if(resq.code === 200) {
                                    customTips.success(resq.message)
                                    let {...temp} = this.state.articleInstance
                                    temp.hasLike = resq.data.status
                                    temp.articleLikes = resq.data.likes
                                    this.setState({ articleInstance: temp })
                                } else {
                                    customTips.error(resq.message)
                                }
                            }).catch(err => {
                                customTips.error(err.message)
                            })
                        }} />
                    }
                </CSSTransition>
            </SwitchTransition>
        )
    }
}
class ArticleVistorList extends React.Component {
    state = {
        requestInstance: {
            pageNum: 1,
            pageSize: 15,
            articleId: this.props.articleId
        },
        commentList: null,
        selectCommentItem: null
    }
    componentDidMount() {
        this.props.childrenRef(this)
        this.commentListGet()
    }
    commentListGet() {
        articleCommentGet(this.state.requestInstance).then(resq => {
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
        return(
            <div className={style.article_vistor_list}>
                {
                    this.state.commentList ===  null ? <CommentSkeleton />:
                    <SwitchTransition mode="out-in">
                        <CSSTransition key={this.state.commentList.length === 0 ? true:false} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                            {
                                this.state.commentList.length === 0 ? <div className={style.empty_box}>当前没有评论，赶快来评论吧 ψ(｀∇´)ψ</div>:
                                <TransitionGroup>
                                    {
                                        this.state.commentList.map(item => {
                                            return (
                                                <Collapse key={item.commentId}>
                                                    <Comment
                                                        userInfo={this.props.userInfo} 
                                                        key={item.commentId}
                                                        foldStatus={this.state.selectCommentItem === item.commentId}
                                                        data={item}
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
                                                            data.append('articleId', this.props.articleId)
                                                            data.append('commentId', item.commentId)
                                                            likeComment(data).then(resq => {
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
                                                            data.append('articleId', this.props.articleId)
                                                            data.append('content', content)
                                                            data.append('replyCommentId', item.commentId)
                                                            data.append('replyUserId', item.replyUser.replyUserId)
                                                            replyComment(data).then(resq => {
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
                                                            data.append('articleId', this.props.articleId)
                                                            data.append('commentId', item.commentId)
                                                            deleteComment(data).then(resq => {
                                                                if(resq.code === 200) {
                                                                    customTips.success(resq.message)
                                                                    setTimeout(() => {
                                                                        let temp = [...this.state.commentList]
                                                                        temp.splice(temp.findIndex(key => key.commentId === item.commentId), 1)
                                                                        this.setState({ commentList: temp })
                                                                    }, 500)
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
                }
            </div>
        )
    }
}
class ArticleContent extends React.Component {
    state = { 
        renderContentRef: React.createRef(),
    }
    componentDidMount(){
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
    render() {
        return(
            <>
                <div className={style.article_detail_info}>
                    <div className={style.article_detail_top}>
                        <img className={style.article_background_image} src={this.props.articleInstance.articlePicture} alt={this.props.articleInstance.nickName}/>
                        <p className={style.article_detail_title}>{this.props.articleInstance.articleTitle}</p>
                        <div className={style.article_data}>
                            <div className={style.data_author}>
                                <Avatar width='3.4rem' height='3.4rem' src={this.props.articleInstance.avatar} title={this.props.articleInstance.nickName} alt={this.props.articleInstance.nickName}/>
                                <div className={style.author_info}>
                                    <span>{this.props.articleInstance.nickName}</span>
                                    <span>{this.props.articleInstance.createTime}</span>
                                </div>
                            </div>
                            <div className={style.article_data_info} onClick={() => { this.props.handleLike(this.props.articleInstance.id) }} >
                                <div><i className="fas fa-eye"/><span>{this.props.articleInstance.articleViews}</span></div>
                                <div><i className={`${'fas fa-heart'} ${this.props.articleInstance.hasLike ? style.article_liked:''}`} /><span>{this.props.articleInstance.articleLikes}</span><WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } /></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.article_render_content} ${renderHtml.render_html}`} ref={this.state.renderContentRef} dangerouslySetInnerHTML={{ __html: this.props.articleInstance.articleContent}}></div>
                </div>
            </>
        )
    }
}
class ArticleSkeleton extends React.Component {
    render() {
        return (
            <div className={style.article_skeleton}>
                <div className={style.article_skeleton_top}>
                    <Skeleton variant="rectangular" width='100%' height='22rem' />
                </div>
                <div className={style.article_skeleton_center}>
                    <Skeleton variant="text" width='10rem' height='2.5rem' sx={{ fontSize: '1rem' }} />
                </div>
                <div className={style.article_skeleton_bottom}>
                    <Skeleton variant="circular" width='3.4rem' height='3.4rem' />
                    <div>
                        <Skeleton variant="text" width='6rem' sx={{ fontSize: '1.25rem' }} />
                        <Skeleton variant="text" width='4rem' sx={{ fontSize: '1.25rem' }} />
                    </div>
                </div>
                <Skeleton variant="rounded" height='20rem' />
            </div>
        )
    }
}
export default ArticleDetail