import { TransitionGroup } from 'react-transition-group'
//hook
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
//样式
import style from '../assets/scss/articleDetail.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
//组件
import Tinymce from '../components/editor'
import customTips from '../util/notostack/customTips'
import Skeleton from '@mui/material/Skeleton'
import Comment from '../components/comment'
import WaterWave from 'water-wave'
import Collapse from '@mui/material/Collapse'
//方法
import { articleContentGet, articleCommentGet, replyComment } from '../util/article'

const ArticleDetail = (props) => {
    //hook
    const { articleId } = useParams()
    const userInfo = useSelector((state) => state.userInfo.info)
    //Params
    const [addCommentStatus, setAddCommentStatus] = useState(false)
    const [articleListRef, setArticleListRef] = useState(null)
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
                <ArticleInfoTop articleId={articleId}/>
                { userInfo !== null ? <Tinymce placeholder='发表一条友善的评论吧...' status={addCommentStatus} getContent={(value) => { sendCommentToServer(value) }}/>:'' }
                <span className={style.article_vistor_title}>评论</span>
                <ArticleVistorList childrenRef={(ref) => { setArticleListRef(ref) }} articleId={articleId} userInfo={userInfo} />
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
                setTimeout(() => {
                    this.setState({ articleInstance: resq.data })
                }, 1000)
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }
    render() {
        return (
            <div className={style.article_detail_info}>
                <div className={style.article_detail_top}>
                    { this.state.articleInstance === '' ? <Skeleton variant="rounded" width='100%' height='20rem' />:<img className={style.article_background_image} src={this.state.articleInstance.articlePicture} alt={this.state.articleInstance.nickName}/> }
                    { this.state.articleInstance === '' ? <Skeleton variant="text" width='20rem' height='4rem' />:<p className={style.article_detail_title}>{this.state.articleInstance.articleTitle}</p> }
                    <div className={style.article_data}>
                        <div className={style.data_author}>
                            {this.state.articleInstance === '' ? <Skeleton variant="circular" width='4rem' height='4rem' />:<img src={this.state.articleInstance.avatar} title={this.state.articleInstance.nickName} alt={this.state.articleInstance.nickName}/>}
                            <div className={style.author_info}>
                                { this.state.articleInstance === '' ? <Skeleton variant="text" width='12rem' height='4rem' />:<span>{this.state.articleInstance.nickName}</span> }
                                { this.state.articleInstance === '' ? <Skeleton variant="text" width='12rem' height='4rem' />:<span>{this.state.articleInstance.createTime}</span> }
                                
                            </div>
                        </div>
                        <div className={style.article_data_info}>
                            { this.state.articleInstance === '' ? <Skeleton variant="text" width='4rem' height='4rem' />:  <div><i className="fas fa-eye"/><span>{this.state.articleInstance.articleViews}</span></div>}
                            { this.state.articleInstance === '' ? <Skeleton variant="text" width='4rem' height='4rem' />:  <div><i className="fas fa-heart" /><span>{this.state.articleInstance.articleLikes}</span><WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } /></div>}
                        </div>
                    </div>
                </div>
                { this.state.articleInstance === '' ? <Skeleton variant="rounded" width='100%' height='10rem' />:<div className={`${style.article_render_content} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: this.state.articleInstance.articleContent}}></div> }
                
            </div>
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
        commentList: []
    }
    componentDidMount() {
        this.props.childrenRef(this)
        this.commentListGet()
    }
    commentListGet() {
        articleCommentGet(this.state.requestInstance).then(resq => {
            if(resq.code === 200) {
                this.setState({
                    commentList: resq.data.list
                })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }
    render() {
        return(
            <ul className={style.article_vistor_list}>
                <TransitionGroup>
                    { 
                        this.state.commentList.map(item => {
                            return (
                                <Collapse key={item.commentId}>
                                    <Comment userInfo={this.props.userInfo} key={item.commentId} data={item}/>
                                </Collapse>
                            )
                        })
                    }
                </TransitionGroup>
            </ul>
        )
    }
}
export default ArticleDetail