import { TransitionGroup } from 'react-transition-group'
//hook
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
//样式
import style from '../assets/scss/articleDetail.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
import '../assets/scss/currencyTransition.scss'
//组件
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import Tinymce from '../components/editor'
import customTips from '../util/notostack/customTips'
import Skeleton from '@mui/material/Skeleton'
import Comment from '../components/comment'
import WaterWave from 'water-wave'
import Collapse from '@mui/material/Collapse'
import Avatar from '../components/Avatar'
//方法
import { articleContentGet, articleCommentGet, replyComment, increaseArticleLike } from '../util/article'
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
    const sendCommentToServer = (content) => {
        if(content === null || content === '' || content === '<p></p>') {
            customTips.warning('不能提交空白哦 ⊙﹏⊙∥')
            return
        }
        if(!addCommentStatus) {
            setAddCommentStatus(true)
            let data = new FormData()
            data.append('articleId', articleId)
            data.append('content', content)
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
    }
    return (
        <div className={style.article_detail}>
            <div className={style.article_detail_content}>
                <ArticleInfoTop articleId={articleId} artContent={(value) => { setArtContentStatus(value) }} />
                <Tinymce ref={tinymce} placeholder='发表一条友善的评论吧...' status={addCommentStatus} getContent={(value) => { sendCommentToServer(value) }}/>
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
    articleLikeReChange(value) {
        let {...temp} = this.state.articleInstance
        temp.hasLike = value.status
        if(value.status) {
            temp.articleLikes++
        } else {
            temp.articleLikes--
        }
        this.setState({ articleInstance: temp })
    }
    componentDidMount(){
        articleContentGet({ 'articleId': this.props.articleId }).then(resq => {
            if(resq.code === 200) {
                setTimeout(() => {
                    this.setState({ articleInstance: resq.data })
                    this.props.artContent(true)
                }, 1000)
            } else {
                customTips.error(resq.message)
                this.props.artContent(true)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }
    render() {
        return (
            this.state.articleInstance  === '' ? <ArticleSkeleton />:<ArticleContent articleInstance={this.state.articleInstance} likeStatusChange={(value) => { this.articleLikeReChange(value) }} />
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
        commentList: null
    }
    componentDidMount() {
        this.props.childrenRef(this)
        this.commentListGet()
    }
    commentListGet() {
        articleCommentGet(this.state.requestInstance).then(resq => {
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
    }
    commentReLike(value) {
        let [...temp] = this.state.commentList
        let index = temp.findIndex(item => item.commentId === value.commentId)
        temp[index].isLike = value.status
        if(value.status) {
            temp[index].likes = temp[index].likes + 1
        } else {
            temp[index].likes = temp[index].likes - 1
        }
        this.setState({ commentList: temp })
    }
    deleteComment(value) {
        let temp = [...this.state.commentList]
        temp.splice(temp.findIndex(item => item.commentId === value), 1)
        this.setState({
            commentList: temp
        })
    }
    render() {
        return(
            <div className={style.article_vistor_list}>
                { this.state.commentList ===  null ? <CommentSkeleton />:this.state.commentList.length === 0 ? <div className={style.empty_box}>当前没有评论，赶快来评论吧 ψ(｀∇´)ψ</div>:<TransitionGroup>
                    { this.state.commentList.map(item => {
                            return (
                                <Collapse key={item.commentId}>
                                    <Comment parentRef={this} articleId={this.props.articleId} userInfo={this.props.userInfo} key={item.commentId} data={item} likeStatusChange={(value) => { this.commentReLike(value) }} deleteComment={(value) => { this.deleteComment(value) }} />
                                </Collapse>
                            )
                        })
                    }
                </TransitionGroup> }
            </div>
        )
    }
}
class ArticleContent extends React.Component {
    componentDidMount(){
    }
    likeArticle() {
        let data = new FormData()
        data.append('articleId', this.props.articleInstance.id)
        increaseArticleLike(data).then(resq => {
            if(resq.code === 200) {
                customTips.success(resq.message)
                this.props.likeStatusChange({ articleId: this.props.articleInstance.id, status: resq.data.status })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }
    render() {
        return(
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
                        <div className={style.article_data_info} onClick={() => { this.likeArticle() }} >
                            <div><i className="fas fa-eye"/><span>{this.props.articleInstance.articleViews}</span></div>
                            <div><i className={`${'fas fa-heart'} ${this.props.articleInstance.hasLike ? style.article_liked:''}`} /><span>{this.props.articleInstance.articleLikes}</span><WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } /></div>
                        </div>
                    </div>
                </div>
                <div className={`${style.article_render_content} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: this.props.articleInstance.articleContent}}></div>
            </div>
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
class CommentSkeleton extends React.Component {
    render() {
        return(
            <div className={style.empty_skeleton}>
                <div className={style.skeleton_top}>
                    <Skeleton variant="circular" width='2.5rem' height='2.5rem' />
                    <div className={style.skeleton_info}>
                        <Skeleton variant="text" width='5rem' sx={{ fontSize: '1.2rem' }} />
                        <Skeleton variant="text" width='3rem' sx={{ fontSize: '1.2rem' }} />
                    </div>
                </div>
                <Skeleton variant="rounded" height='3rem' />
            </div>
        )
    }
}
class EditorSkeleton extends React.Component {
    render() {
        return (
            <div className={style.editor_skeleton}>
                <div className={style.editor_top}>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width='100%' height='3rem' />
                    </div>
                    <div>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width='100%' height='3rem' />
                    </div>
                </div>
                <Skeleton variant="rounded" width='100%' height='8rem' />
            </div>
        )
    }
}
export default ArticleDetail