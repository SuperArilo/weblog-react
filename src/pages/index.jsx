import React, { useState } from 'react'
//样式
import style from '../assets/scss/indexPage.module.scss'
import '../assets/scss/currencyTransition.scss'
import 'water-wave/style.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
//组件
import Switch from '@mui/material/Switch'
import AsukaButton from '../components/asukaButton'
import WaterWave from 'water-wave'
import GossipContent from '../components/gossipContent'
import Slider from "react-slick"
import Skeleton from '@mui/material/Skeleton'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
//hook
import { articleListGet } from '../util/article'
import { useNavigate } from "react-router-dom"
import $ from 'jquery'
//方法
import { gossipList } from '../util/gossip'
import { increaseArticleLike } from '../util/article'
import customTips from '../util/notostack/customTips'
class IndexPage extends React.Component {
    state = {
        articleList: [],
        hotArticleList: [],
        gossipList: [],
        sliderIndex: 0,
        sliderRef: React.createRef(),
        articleRequestInstance: {
            pageNum: 1,
            pageSize: 10
        },
        hotArticleRequestInstance: {
            pageNum: 1,
            pageSize: 3,
            keyword: 'hot'
        },
        gossipRequestInstance: {
            pageNum: 1,
            pageSize: 10
        },
        SliderSettings: {
            adaptiveHeight: false,
            arrows: false,
            fade: true,
            dots: false,
            infinite: true,
            autoplay: true,
            centerPadding: '0px',
            speed: 300,
            afterChange: (index) => {
                this.setState({ sliderIndex: index })
            }
        }
    }
    componentDidMount(){
        articleListGet(this.state.hotArticleRequestInstance).then(resq => {
            if(resq.code === 200) {
                this.setState({ hotArticleList: resq.data.list })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
        articleListGet(this.state.articleRequestInstance).then(resq => {
            if(resq.code === 200) {
                this.setState({ articleList: resq.data.list })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
        gossipList(this.state.gossipRequestInstance).then(resq => {
            if(resq.code === 200) {
                this.setState({ gossipList: resq.data.list })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }
    articleLikeReChange(value) {
        let [...temp] = this.state.articleList
        let index = temp.findIndex(item => item.id === value.articleId)
        temp[index].isLike = value.status
        if(value.status) {
            temp[index].articleLikes = temp[index].articleLikes + 1
        } else {
            temp[index].articleLikes = temp[index].articleLikes - 1
        }
        this.setState({ articleList: temp })
    }
    render() {
        return (
            <div className={ this.props.isMobile ? style.index_content_mobile:style.index_content }>
                <div className={style.index_sider}>
                    <header className={style.sider_header_tips}>
                        <Switch defaultChecked onChange={(e) => { 
                            if(e.target.checked) {
                                this.state.sliderRef.current.slickPlay() 
                            } else {
                                this.state.sliderRef.current.slickPause() 
                            }
                        }} />
                        <span className={style.auto_play_span}>自动播放</span>
                    </header>
                    <SwitchTransition mode="out-in">
                        <CSSTransition key={this.state.hotArticleList.length === 0 ? true:false} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                            {
                                this.state.hotArticleList.length === 0 ? <div className={style.loading_sider}><i className='fas fa-circle-notch fa-spin' /></div>:
                                <section className={style.sider_carousel}>
                                    <Slider ref={this.state.sliderRef} {...this.state.SliderSettings}>
                                        {
                                            this.state.hotArticleList.map(item => { return <SiderItem key={item.id} object={item} /> })
                                        }
                                    </Slider>
                                    <ul className={style.sider_carousel_index}>
                                        {
                                            this.state.hotArticleList.map((item, index) => {
                                                return (
                                                    <li key={item.id} onClick={() => { this.state.sliderRef.current.slickGoTo(index, false) }}>
                                                        <i className={this.state.sliderIndex === index ? 'fas fa-circle':'far fa-circle'} />
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
                            <CSSTransition classNames='change' key={this.state.articleList.length === 0 ? true:false} timeout={300} mountOnEnter={true} unmountOnExit={true}>
                                {
                                    this.state.articleList.length === 0 ? <ArticleSkeleton />:
                                    <ul className={style.article_list}>
                                        {
                                            this.state.articleList.map(item => {
                                                return (<Article key={item.id} item={item} likeStatusChange={(value) => { this.articleLikeReChange(value) }} />)
                                            })
                                        }
                                    </ul>
                                }
                            </CSSTransition>
                        </SwitchTransition>
                    </div>
                    <div className={style.public_sub_content}>
                        <span className={style.public_sub_content_header}>最近碎语</span>
                        <div className={style.gossip_list}>
                            {
                                this.state.gossipList.map(item => {
                                    return <GossipContent key={item.id} data={item} />
                                })
                            }
                        </div>
                    </div>
                </section>
            </div>
        )
    }
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
                    $('#react-by-asukamis').children().stop().animate({'scrollTop': 0})
                }}/>
            </div>
        </div>
    )
}
const Article = (props) => {
    //hook
    const navigate = useNavigate()
    //params

    const likeArticle = (object) => {
        let data = new FormData()
        data.append('articleId', object.id)
        increaseArticleLike(data).then(resq => {
            if(resq.code === 200) {
                customTips.success(resq.message)
                props.likeStatusChange({ articleId: object.id, status: resq.data.status })
            } else {
                customTips.error(resq.message)
            }            
        }).catch(err => {
            customTips.error(err.message)
        })
    }
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
                        $('#react-by-asukamis').children().stop().animate({'scrollTop': 0})
                     }}/>
                    <div className={style.right_article_data}>
                        <div>
                            <i className="fas fa-eye"/>
                            <span>{props.item.articleViews}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                        </div>
                        <div onClick={() => { likeArticle(props.item) }}>
                            <i className={`${'fas fa-heart'} ${props.item.isLike ? style.article_is_liked:''}`} />
                            <span>{props.item.articleLikes}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                        </div>
                        <div>
                            <i className="fas fa-comment-alt"/>
                            <span>{props.item.commentTotal}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}
class ArticleSkeleton extends React.Component {
    render() {
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
}
export default IndexPage