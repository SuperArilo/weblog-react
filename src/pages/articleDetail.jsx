import { TransitionGroup, SwitchTransition, CSSTransition } from 'react-transition-group'
//hook
import React, { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
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
import Pagination from '../components/Pagination'
//方法
import { articleContentGet, articleCommentGet, replyComment, increaseArticleLike, likeComment, deleteComment } from '../util/article'
import ImageViewer from 'awesome-image-viewer'
import $ from 'jquery'
export default function ArticleDetail(props) {
    //hook
    const [searchParams, setSearchParams] = useSearchParams()
    const articleId = searchParams.get('threadId')
    //Params
    const [addCommentStatus, setAddCommentStatus] = useState(false)
    const articleContentRef = useRef(null)
    const articleListRef = useRef(null)
    const tinymce = useRef(null)
    //function
    return (
        <div className={style.article_detail}>
            <div className={style.article_detail_content}>
                <ArticleInfoTop ref={articleContentRef} articleId={articleId} userInfo={props.userInfo} />
                { 
                    articleContentRef.current === null || articleContentRef.current.state.articleInstance === '' ? '':
                    <Tinymce
                        userInfo={props.userInfo}
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
                                        articleListRef.current.reRequestComment()
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
                }
                <span className={style.article_vistor_title}>评论</span>
                <ArticleVistorList
                    ref={articleListRef}
                    articleId={articleId}
                    userInfo={props.userInfo}/>
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
                this.setState({ articleInstance: resq.data })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
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
                                                                                        if(!this.props.userInfo) {
                                                                                            customTips.info('你需要登录才能进行下一步操作哦')
                                                                                            return
                                                                                        }
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
const ArticleVistorList = forwardRef((props, ref) => {
    //params
    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10,
        articleId: props.articleId
    })
    const [commentObject, setCommentObject] = useState({
        pages: 1,
        total: 0,
        current: 0,
        list: null
    })
    const [selectCommentItem, setSelectCommentItem] = useState(null)

    const commentRef = useRef(null)

    //function
    const commentData = useCallback(instance => {
        articleCommentGet(instance).then(resq => {
            if(resq.code === 200) {
                setCommentObject(target => { return { ...target, list: resq.data.list, pages: resq.data.pages, current: resq.data.current, total: resq.data.total} })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }, [])
    useEffect(() => {
        commentData(requestInstance)
    }, [requestInstance, commentData])

    useImperativeHandle(ref, () => ({
        reRequestComment: () => {
            articleCommentGet(requestInstance).then(resq => {
                if(resq.code === 200) {
                    setCommentObject(current => { return { ...current, pages: resq.data.pages, list: resq.data.list } })
                } else {
                    customTips.error(resq.message)
                }
            }).catch(err => {
                customTips.error(err.message)
            })
        }
    }))
    return (
        <>
            <div className={style.article_vistor_list}>
                {
                    commentObject.list ===  null ? <CommentSkeleton />:
                    <SwitchTransition mode="out-in">
                        <CSSTransition key={commentObject.list.length === 0} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                            {
                                commentObject.list.length === 0 ? <div className={style.empty_box}>当前没有评论，赶快来评论吧 ψ(｀∇´)ψ</div>:
                                <TransitionGroup>
                                    {
                                        commentObject.list.map(item => {
                                            return (
                                                <Collapse key={item.commentId}>
                                                    <Comment
                                                        ref={commentRef}
                                                        userInfo={props.userInfo}
                                                        key={item.commentId}
                                                        foldStatus={selectCommentItem === item.commentId}
                                                        data={item}
                                                        handleFold={(id) => { setSelectCommentItem(id === selectCommentItem ? null:id) }}
                                                        handleLike={() => { 
                                                            if(props.userInfo === null) {
                                                                customTips.info('你需要登陆才能继续哦 ⊙﹏⊙∥')
                                                                return
                                                            }
                                                            let data = new FormData()
                                                            data.append('articleId', props.articleId)
                                                            data.append('commentId', item.commentId)
                                                            likeComment(data).then(resq => {
                                                                if(resq.code === 200) {
                                                                    customTips.success(resq.message)
                                                                    let [...temp] = commentObject.list
                                                                    let index = temp.findIndex(key => key.commentId === item.commentId)
                                                                    temp[index].isLike = resq.data.status
                                                                    temp[index].likes = resq.data.likes
                                                                    setCommentObject({...commentObject, list: temp})
                                                                } else {
                                                                    customTips.error(resq.message)
                                                                }
                                                            }).catch(err => {
                                                                customTips.error(err.message)
                                                            })
                                                        }}
                                                        handleReply={(content) => {
                                                            let data = new FormData()
                                                            data.append('articleId', props.articleId)
                                                            data.append('content', content)
                                                            data.append('replyCommentId', item.commentId)
                                                            data.append('replyUserId', item.replyUser.replyUserId)
                                                            replyComment(data).then(resq => {
                                                                if(resq.code === 200) {
                                                                    customTips.success(resq.message)
                                                                    commentData(requestInstance)
                                                                    setSelectCommentItem(null)
                                                                } else {
                                                                    customTips.error(resq.message)
                                                                }
                                                                commentRef.current.changeEditorLoadingStatus(false)
                                                            }).catch(err => {
                                                                customTips.error(err.message)
                                                                commentRef.current.changeEditorLoadingStatus(false)
                                                            })
                                                        }}
                                                        handleDelete={() => {
                                                            let data = new FormData()
                                                            data.append('articleId', props.articleId)
                                                            data.append('commentId', item.commentId)
                                                            deleteComment(data).then(resq => {
                                                                if(resq.code === 200) {
                                                                    customTips.success(resq.message)
                                                                    setTimeout(() => {
                                                                        commentData(requestInstance)
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
            {
                commentObject.pages === 1 || commentObject.pages === 0 ? '':
                <Pagination 
                    pages={commentObject.pages}
                    current={commentObject.current}
                    onPageChange={e => { setRequestInstance({...requestInstance, pageNum: e}) }}/>
            }
            
        </>
    )
})
const ArticleContent = (props) => {
    //hook
    const navigate = useNavigate()
    //params
    const renderContentRef = useRef(null)
    useEffect(() => {
        $(renderContentRef.current).find('img').on('click', (element) => {
            let list = []
            $(renderContentRef.current).find('img').each((index, e) => {
                list.push({ mainUrl: $(e).attr('src'), index: index })
            })
            new ImageViewer({
                images: list,
                showThumbnails: false,
                isZoomable: false,
                currentSelected: list.findIndex(item => item.mainUrl === $(element.target).attr('src'))
            })
        })
    }, [])
    return (
        <>
            <div className={style.article_detail_info}>
                <div className={style.article_detail_top}>
                    <img className={style.article_background_image} src={props.articleInstance.articlePicture} alt={props.articleInstance.nickName}/>
                    <p className={style.article_detail_title}>{props.articleInstance.articleTitle}</p>
                    <div className={style.article_data}>
                        <div className={style.data_author}>
                            <Avatar
                                width='3.4rem'
                                height='3.4rem'
                                src={props.articleInstance.avatar}
                                title={props.articleInstance.nickName}
                                alt={props.articleInstance.nickName}
                                onClick={() => { navigate(`/user/${props.articleInstance.publisher}`) }}/>
                            <div className={style.author_info}>
                                <span>{props.articleInstance.nickName}</span>
                                <span>{props.articleInstance.createTime}</span>
                            </div>
                        </div>
                        <div className={style.article_data_info}>
                            <div><i className="fas fa-eye"/><span>{props.articleInstance.articleViews}</span></div>
                            <div onClick={() => { props.handleLike(props.articleInstance.id) }}><i className={`${'fas fa-heart'} ${props.articleInstance.hasLike ? style.article_liked:''}`} /><span>{props.articleInstance.articleLikes}</span><WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } /></div>
                        </div>
                    </div>
                </div>
                <div
                    className={`${style.article_render_content} ${renderHtml.render_html}`}
                    ref={renderContentRef}
                    dangerouslySetInnerHTML={{ __html: props.articleInstance.articleContent}} />
            </div>
        </>
    )

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