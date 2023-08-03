import { TransitionGroup, SwitchTransition, CSSTransition } from 'react-transition-group'
//hook
import React, { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
//样式
import style from '../assets/scss/articleDetail.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
import '../assets/scss/currencyTransition.scss'
//组件
import Tinymce from '../components/editor'
import toast from 'react-hot-toast'
import Skeleton from '@mui/material/Skeleton'
import Comment from '../components/comment'
import WaterWave from '../components/WaterWave'
import Collapse from '@mui/material/Collapse'
import Avatar from '../components/Avatar'
import CommentSkeleton from '../components/CommentSkeleton'
import Pagination from '../components/Pagination'
import PreviewImage from '../components/PreviewImage'
//方法
import { articleContentGet, articleCommentGet, replyComment, increaseArticleLike, likeComment, deleteComment } from '../util/article'

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
                    <div className={style.article_detail_editor}>
                        <Tinymce
                        userInfo={props.userInfo}
                        ref={tinymce} 
                        placeholder='发表一条友善的评论吧...' 
                        status={addCommentStatus} 
                        getContent={(value) => { 
                            if(value === null || value === '' || value === '<p></p>') {
                                toast('不能提交空白哦 ⊙﹏⊙∥')
                                return
                            }
                            if(!addCommentStatus) {
                               const id = toast.loading('提交中...')
                                setAddCommentStatus(true)
                                let data = new FormData()
                                data.append('articleId', articleId)
                                data.append('content', value)
                                replyComment(data).then(resq => {
                                    if(resq.code === 200) {
                                        tinymce.current.clear()
                                        toast.success(resq.message, { id: id })
                                        articleListRef.current.reRequestComment()
                                    } else if(resq.code === 0) {
                                        toast(resq.message, { id: id })
                                    } else {
                                        toast.error(resq.message, { id: id })
                                    }
                                    setAddCommentStatus(false)
                                }).catch(err => {
                                    toast.error(err.message, { id: id })
                                    setAddCommentStatus(false)
                                })
                            }
                        }}/>
                    </div>
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
                toast.error(resq.message)
            }
        }).catch(err => {
            toast.error(err.message)
        })
    }
    render() {
        return (
            <SwitchTransition mode='out-in'>
                <CSSTransition key={this.state.articleInstance  === ''} timeout={300} classNames="change" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                    {
                        this.state.articleInstance  === '' ?
                        <ArticleSkeleton />
                        :
                        <ArticleContent 
                            articleInstance={this.state.articleInstance} 
                            handleLike={(articleId) => { 
                                if(!this.props.userInfo) {
                                    toast('你需要登录才能进行下一步操作哦')
                                    return
                                }
                                const id = toast.loading('提交中...')
                                let data = new FormData()
                                data.append('articleId', articleId)
                                increaseArticleLike(data).then(resq => {
                                    
                                    if(resq.code === 200) {
                                        toast.success(resq.message, { id: id })
                                        let {...temp} = this.state.articleInstance
                                        temp.hasLike = resq.data.status
                                        temp.articleLikes = resq.data.likes
                                        this.setState({ articleInstance: temp })
                                    } else if(resq.code === 0) {
                                        toast(resq.message, { id: id })
                                    } else {
                                        toast.error(resq.message, { id: id })
                                    }
                                }).catch(err => {
                                    
                                    toast.error(err.message, { id: id })
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
                toast.error(resq.message)
            }
        }).catch(err => {
            toast.error(err.message)
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
                    toast.error(resq.message)
                }
            }).catch(err => {
                toast.error(err.message)
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
                                                                toast('你需要登陆才能继续哦 ⊙﹏⊙∥')
                                                                return
                                                            }
                                                            const id = toast.loading('提交中...')
                                                            let data = new FormData()
                                                            data.append('articleId', props.articleId)
                                                            data.append('commentId', item.commentId)
                                                            likeComment(data).then(resq => {
                                                                
                                                                if(resq.code === 200) {
                                                                    toast.success(resq.message, { id: id })
                                                                    let [...temp] = commentObject.list
                                                                    let index = temp.findIndex(key => key.commentId === item.commentId)
                                                                    temp[index].like = resq.data.status
                                                                    temp[index].likes = resq.data.likes
                                                                    setCommentObject({...commentObject, list: temp})
                                                                } else if(resq.code === 0) {
                                                                    toast(resq.message, { id: id })
                                                                } else {
                                                                    toast.error(resq.message, { id: id })
                                                                }
                                                            }).catch(err => {
                                                                
                                                                toast.error(err.message, { id: id })
                                                            })
                                                        }}
                                                        handleReply={(content) => {
                                                            const id = toast.loading('提交中...')
                                                            let data = new FormData()
                                                            data.append('articleId', props.articleId)
                                                            data.append('content', content)
                                                            data.append('replyCommentId', item.commentId)
                                                            data.append('replyUserId', item.replyUser.replyUserId)
                                                            replyComment(data).then(resq => {
                                                                if(resq.code === 200) {
                                                                    toast.success(resq.message, { id: id })
                                                                    commentData(requestInstance)
                                                                    setSelectCommentItem(null)
                                                                } else if (resq.code === 0) {
                                                                    toast(resq.message, { id: id })
                                                                } else {
                                                                    toast.error(resq.message, { id: id })
                                                                }
                                                                commentRef.current.changeEditorLoadingStatus(false)
                                                            }).catch(err => {
                                                                
                                                                toast.error(err.message, { id: id })
                                                                commentRef.current.changeEditorLoadingStatus(false)
                                                            })
                                                        }}
                                                        handleDelete={() => {
                                                            const id = toast.loading('提交中...')
                                                            let data = new FormData()
                                                            data.append('articleId', props.articleId)
                                                            data.append('commentId', item.commentId)
                                                            deleteComment(data).then(resq => {
                                                                
                                                                if(resq.code === 200) {
                                                                    toast.success(resq.message, { id: id })
                                                                    setTimeout(() => {
                                                                        commentData(requestInstance)
                                                                    }, 500)
                                                                } else {
                                                                    toast.error(resq.message, { id: id })
                                                                }
                                                            }).catch(err => {
                                                                
                                                                toast.error(err.message, { id: id })
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
    
    return (
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
                        <div onClick={() => { props.handleLike(props.articleInstance.id) }}><i className={`${'fas fa-heart'} ${props.articleInstance.hasLike ? style.article_liked:''}`} /><span>{props.articleInstance.articleLikes}</span><WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } /></div>
                    </div>
                </div>
            </div>
            <div
                className={`${style.article_render_content} ${renderHtml.render_html}`}
                ref={renderContentRef}
                dangerouslySetInnerHTML={{ __html: props.articleInstance.articleContent}} />
            <PreviewImage current={renderContentRef} />
        </div>
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