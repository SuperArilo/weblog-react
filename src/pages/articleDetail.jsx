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
import PreviewImage from '../components/PreviewImage'
import Pagination from '../components/Pagination'
import Svg from 'react-inlinesvg'
//方法
import { articleContentGet, articleCommentGet, replyComment, increaseArticleLike, likeComment, deleteComment } from '../util/article'

export default function ArticleDetail(props) {
    //hook
    const [searchParams, setSearchParams] = useSearchParams()
    const articleId = searchParams.get('threadId')
    //Params
    const [addCommentStatus, setAddCommentStatus] = useState(false)
    const articleListRef = useRef(null)
    const tinymce = useRef(null)
    //function
    return (
        <div className={style.article_detail}>
            <div className={style.article_detail_content}>
                <ArticleInfoTop articleId={articleId} userInfo={props.userInfo} />
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
                                setAddCommentStatus(true)
                                let data = new FormData()
                                data.append('articleId', articleId)
                                data.append('content', value)
                                replyComment({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                    if(resq.code === 200) {
                                        tinymce.current.clear()
                                        articleListRef.current.reRequestComment()
                                    }
                                    setAddCommentStatus(false)
                                }).catch(err => {
                                    setAddCommentStatus(false)
                                })
                            }
                        }}/>
                </div>
                <span className={style.article_vistor_title}>评论</span>
                <ArticleVistorList
                    ref={articleListRef}
                    articleId={articleId}
                    userInfo={props.userInfo}/>
            </div>
        </div>
    )
}
const ArticleInfoTop = props => {

    const [articleInstance, setArticleInstance] = useState('')

    const dataGet = useCallback(() => {
        articleContentGet({ data: { 'articleId': props.articleId }, toast: null }).then(resq => {
            if(resq.code === 200) {
                setArticleInstance(resq.data)
            }
        }).catch(err => { })
    }, [props.articleId])

    useEffect(() => {
        dataGet()
    }, [dataGet])

    return (
        <SwitchTransition mode='out-in'>
            <CSSTransition key={articleInstance  === ''} timeout={300} classNames="change" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                {
                    articleInstance  === '' ?
                    <ArticleSkeleton />
                    :
                    <ArticleContent 
                        articleInstance={articleInstance} 
                        handleLike={(articleId) => { 
                            if(!props.userInfo) {
                                toast('你需要登录才能进行下一步操作哦')
                                return
                            }
                            let data = new FormData()
                            data.append('articleId', articleId)
                            increaseArticleLike({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                if(resq.code === 200) {
                                    let {...temp} = articleInstance
                                    temp.hasLike = resq.data.status
                                    temp.articleLikes = resq.data.likes
                                    setArticleInstance(temp)
                                }
                            }).catch(err => { })
                        }} />
                }
            </CSSTransition>
        </SwitchTransition>
    )
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
        articleCommentGet({ data: instance, toast: null }).then(resq => {
            if(resq.code === 200) {
                setCommentObject(target => { return { ...target, list: resq.data.list, pages: resq.data.pages, current: resq.data.current, total: resq.data.total} })
            }
        }).catch(err => { })
    }, [])
    useEffect(() => {
        commentData(requestInstance)
    }, [requestInstance, commentData])

    useImperativeHandle(ref, () => ({
        reRequestComment: () => {
            articleCommentGet({ data: requestInstance, toast: null }).then(resq => {
                if(resq.code === 200) {
                    setCommentObject(current => { return { ...current, pages: resq.data.pages, list: resq.data.list } })
                }
            }).catch(err => { })
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
                                                            let data = new FormData()
                                                            data.append('articleId', props.articleId)
                                                            data.append('commentId', item.commentId)
                                                            likeComment({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                if(resq.code === 200) {
                                                                    let [...temp] = commentObject.list
                                                                    let index = temp.findIndex(key => key.commentId === item.commentId)
                                                                    temp[index].like = resq.data.status
                                                                    temp[index].likes = resq.data.likes
                                                                    setCommentObject({...commentObject, list: temp})
                                                                }
                                                            }).catch(err => { })
                                                        }}
                                                        handleReply={(content) => {
                                                            let data = new FormData()
                                                            data.append('articleId', props.articleId)
                                                            data.append('content', content)
                                                            data.append('replyCommentId', item.commentId)
                                                            data.append('replyUserId', item.replyUser.replyUserId)
                                                            replyComment({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                if(resq.code === 200) {
                                                                    commentData(requestInstance)
                                                                    setSelectCommentItem(null)
                                                                }
                                                                commentRef.current.changeEditorLoadingStatus(false)
                                                            }).catch(err => {
                                                                commentRef.current.changeEditorLoadingStatus(false)
                                                            })
                                                        }}
                                                        handleDelete={() => {
                                                            let data = new FormData()
                                                            data.append('articleId', props.articleId)
                                                            data.append('commentId', item.commentId)
                                                            deleteComment({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                if(resq.code === 200) {
                                                                    setTimeout(() => {
                                                                        commentData(requestInstance)
                                                                    }, 500)
                                                                }
                                                            }).catch(err => { })
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
                    position='right'
                    count={commentObject.pages}
                    page={commentObject.current}
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
                        <div>
                            <Svg
                                cacheRequests={true}
                                src='https://image.superarilo.icu/svg/view.svg'
                                width='1.1rem'
                                height='1.1rem'/>
                            <span>{props.articleInstance.articleViews}</span>
                        </div>
                        <div onClick={() => { props.handleLike(props.articleInstance.id) }}>
                            <Svg
                                cacheRequests={true}
                                src='https://image.superarilo.icu/svg/like.svg'
                                preProcessor={code => code.replace(/fill=".*?"/g, 'fill="currentColor"')}
                                className={props.articleInstance.hasLike ? style.article_liked:''}
                                width='1.1rem'
                                height='1.1rem'/>
                            <span>{props.articleInstance.articleLikes}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
                        </div>
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
const ArticleSkeleton = () => {
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