//样式
import style from '../assets/scss/indexPage.module.scss'
import '../assets/scss/currencyTransition.scss'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
//组件
import Switch from '@mui/material/Switch'
import AsukaButton from '../components/asukaButton'
import WaterWave from '../components/WaterWave'
import GossipContent from '../components/gossipContent'
import Slider from "react-slick"
import GossipSkeleton from '../components/GossipSkeleton'
import Skeleton from '@mui/material/Skeleton'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import Pagination from '../components/Pagination'
import Friends from './Friends'
//hook
import { articleListGet } from '../util/article'
import { useNavigate } from "react-router-dom"
import React, { useState, useRef, useEffect, useCallback } from 'react'
//方法
import { gossipListRequest, likeGossip } from '../util/gossip'
import { increaseArticleLike } from '../util/article'
import toast from 'react-hot-toast'
import $ from 'jquery'
export default function IndexPage(props) {
    //params
    const [articleObject, setArticleObject] = useState({
        pages: 1,
        total: 0,
        current: 0,
        list: []
    })
    const [hotArticleList, setHotArticleList] = useState([])
    const [gossipList, setGossipList] = useState([])

    const [selectGossipItem, setSelectGossipItem] = useState(null)

    //instane
    const [articleRequestInstance, setArticleRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10
    })
    const [hotArticleRequestInstance, setHotArticleRequestInstance] = useState({
        pageNum: 1,
        pageSize: 3,
        keyword: 'hot'
    })
    const [gossipRequestInstance, setGossipRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10
    })
    //slider
    const sliderRef = useRef(null)
    const [sliderIndex, setSliderIndex] = useState(0)
    const [sliderSettings, setSliderSettings] = useState({
        adaptiveHeight: false,
        arrows: false,
        fade: true,
        dots: false,
        infinite: true,
        autoplay: true,
        centerPadding: '0px',
        speed: 300,
        afterChange: (index) => {
            setSliderIndex(index)
        }
    })
    //function
    const articleData = useCallback((instance) => {
        articleListGet(instance).then(resq => {
            if(resq.code === 200) {
                setArticleObject(target => { return ({ ...target, list: resq.data.list, pages: resq.data.pages, total: resq.data.total, current: resq.data.current }) })
            }
        }).catch(() => {})
    }, [])
    const hotArticleData = useCallback((instance) => {
        articleListGet(instance).then(resq => {
            if(resq.code === 200) {
                setHotArticleList(resq.data.list)
            }
        }).catch(() => {})
    }, [])
    const gossipData = useCallback((instance) => {
        gossipListRequest(instance).then(resq => {
            if(resq.code === 200) {
                setGossipList(resq.data.instance.list)
            }
        }).catch(() => {})
    }, [])

    //顶部
    useEffect(() => {
        hotArticleData(hotArticleRequestInstance)
    }, [hotArticleRequestInstance, hotArticleData])
    //文章
    useEffect(() => {
        articleData(articleRequestInstance)
    }, [articleRequestInstance, articleData])
    //碎语
    useEffect(() => {
        gossipData(gossipRequestInstance)
    }, [gossipRequestInstance, gossipData])

    return (
        <div className={ props.isMobile ? style.index_content_mobile:style.index_content }>
            <div className={style.index_sider}>
                <header className={style.sider_header_tips}>
                    <Switch defaultChecked onChange={(e) => { 
                        if(e.target.checked) {
                            sliderRef.current.slickPlay() 
                        } else {
                            sliderRef.current.slickPause() 
                        }
                    }} />
                    <span className={style.auto_play_span}>自动播放</span>
                </header>
                <SwitchTransition mode="out-in">
                    <CSSTransition key={hotArticleList.length === 0} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                        {
                            hotArticleList.length === 0 ? <div className={style.loading_sider}><i className={`${'asukamis loading'} ${'rotate'}`} /></div>:
                            <section className={style.sider_carousel}>
                                <Slider ref={sliderRef} {...sliderSettings}>
                                    {
                                        hotArticleList.map(item => { return <SiderItem key={item.id} object={item} /> })
                                    }
                                </Slider>
                                <ul className={style.sider_carousel_index}>
                                    {
                                        hotArticleList.map((item, index) => {
                                            return (
                                                <li key={item.id} onClick={() => { sliderRef.current.slickGoTo(index, false) }}>
                                                    <i className={`${sliderIndex === index ? 'fas':'far'} fa-circle`} />
                                                </li>
                                            )
                                        }) 
                                    }
                                </ul>
                            </section>
                        }
                    </CSSTransition>
                </SwitchTransition>
            </div>
            <section className={style.index_section}>
                <div className={style.public_sub_content}>
                    <span className={style.public_sub_content_header}>全部文章</span>
                    <SwitchTransition mode='out-in'>
                        <CSSTransition classNames='change' key={articleObject.list.length === 0} timeout={300} mountOnEnter={true} unmountOnExit={true}>
                            {
                                articleObject.list.length === 0 ? <ArticleSkeleton />:
                                <ul className={style.article_list}>
                                    {
                                        articleObject.list.map(item => {
                                            return <Article 
                                                        key={item.id}
                                                        item={item}
                                                        handleLike={(articleId) => { 
                                                            if(props.userInfo === null) {
                                                                toast('你需要登录哦 (￣y▽,￣)╭ ')
                                                                return
                                                            }
                                                            let data = new FormData()
                                                            data.append('articleId', articleId)
                                                            increaseArticleLike({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                if(resq.code === 200) {
                                                                    let [...temp] = articleObject.list
                                                                    let index = temp.findIndex(item => item.id === articleId)
                                                                    temp[index].like = resq.data.status
                                                                    temp[index].articleLikes = resq.data.likes
                                                                    setArticleObject({...articleObject, list: temp})
                                                                }           
                                                            }).catch(err => {})
                                                        }} 
                                                    />
                                        })
                                    }
                                </ul>
                            }
                        </CSSTransition>
                    </SwitchTransition>
                    {
                        articleObject.pages === 0 || articleObject.pages === 1 ? '':
                        <Pagination
                            position='right'
                            count={articleObject.pages}
                            page={articleObject.current}
                            onPageChange={e => { setArticleRequestInstance({...articleRequestInstance, pageNum: e}) }}/>
                    }
                </div>
                <div className={style.public_sub_content}>
                    <span className={style.public_sub_content_header}>最近碎语</span>
                    <SwitchTransition mode='out-in'>
                        <CSSTransition key={gossipList.length === 0} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                            {
                                gossipList.length === 0 ? <GossipSkeleton />:
                                <div className={style.gossip_list}>
                                    {
                                        gossipList.map(item => {
                                            return <GossipContent
                                                        key={item.id} 
                                                        data={item} 
                                                        userInfo={props.userInfo}
                                                        foldStatus={selectGossipItem === item.id}
                                                        handleFold={id => { setSelectGossipItem(selectGossipItem === id ? null:id) }}
                                                        handleLike={(gossipId) => {
                                                            if(props.userInfo === null) {
                                                                toast('你需要登录哦 (￣y▽,￣)╭ ')
                                                                return
                                                            }
                                                            let data = new FormData()
                                                            data.append('gossipId', gossipId)
                                                            likeGossip({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                                                if(resq.code === 200) {
                                                                    let temp = [...gossipList]
                                                                    let index = temp.findIndex(item => item.id === gossipId)
                                                                    if(resq.data.status) {
                                                                        temp[index].likes++
                                                                    } else {
                                                                        if(temp[index].likes >= 0) {
                                                                            temp[index].likes--
                                                                        }
                                                                    }
                                                                    temp[index].like = resq.data.status
                                                                    setGossipList(temp)
                                                                }
                                                            }).catch(err => {})
                                                        }}
                                                        gossipDataGet={() => {
                                                            gossipData(gossipRequestInstance)
                                                        }}
                                                        handleGossipList={() => {
                                                            gossipData(gossipRequestInstance)
                                                        }}/>
                                        })
                                    }
                                </div>
                            }
                        </CSSTransition>
                    </SwitchTransition>
                    <span className={style.public_sub_content_header}>最近访客</span>
                    <Friends columns='1fr 1fr 1fr' defaultHeight={false}/>
                </div>
            </section>
        </div>
    )
}
const SiderItem = (props) => {
    //hook
    const navigate = useNavigate()
    return (
        <div className={style.sider_item} key={props.object.id}>
            <img src={props.object.articlePicture} alt='' title=''/>
            <div className={style.article_info}>
                <p>{props.object.articleTitle}</p>
                <AsukaButton text='开始阅读' class='read' onClick={() => { 
                    navigate('detail?threadId=' + props.object.id)
                    $('#react-by-asukamis').stop().animate({'scrollTop': 0})
                }}/>
            </div>
        </div>
    )
}
const Article = (props) => {
    //hook
    const navigate = useNavigate()
    //params
    return (
        <li>
            <img src={props.item.articlePicture} title={props.item.articleTitle} alt={props.item.articleTitle} />
            <div className={style.article_info_item}>
                <p className={style.article_title}>{props.item.articleTitle}</p>
                <span className={style.article_time}>{props.item.createTime}</span>
                <p className={style.article_introduce}>{props.item.articleIntroduction}</p>
                <div className={style.article_bottom_function}>
                    <AsukaButton text='开始阅读' class='read' onClick={() => { 
                        navigate('detail?threadId=' + props.item.id)
                        $('#react-by-asukamis').stop().animate({'scrollTop': 0})
                     }}/>
                    <div className={style.right_article_data}>
                        <div>
                            <i className="fas fa-eye"/>
                            <span>{props.item.articleViews}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
                        </div>
                        <div onClick={() => { props.handleLike(props.item.id) }}>
                            <i className={`${'fas fa-heart'} ${props.item.like ? style.article_is_liked:''}`} />
                            <span>{props.item.articleLikes}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
                        </div>
                        <div>
                            <i className="fas fa-comment-alt"/>
                            <span>{props.item.comments}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}
const ArticleSkeleton = () => {
    return (
        <div className={style.article_skeleton}>
            <Skeleton variant="rounded" width='100%' height='21rem' />
            <div className={style.article_skeleton_box}>
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} width='100%' height='3rem' />
                <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='8rem' height='2.5rem' />
                <Skeleton variant="text" sx={{ fontSize: '0.7rem' }} width='100%' height='2rem' />
                <Skeleton variant="text" sx={{ fontSize: '0.7rem' }} width='14rem' height='2rem' />
                <div className={style.article_skeleton_bottom}>
                    <Skeleton variant="rounded" width='5rem' height='1.8rem' />
                    <div className={style.right_data}>
                        <div>
                            <Skeleton variant="rounded" width='2.8rem' height='1.5rem' />
                        </div>
                        <div>
                            <Skeleton variant="rounded" width='2.8rem' height='1.5rem' />
                        </div>
                        <div>
                            <Skeleton variant="rounded" width='2.8rem' height='1.5rem' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}