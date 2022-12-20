import React, { useState } from 'react'
import style from '../assets/scss/indexPage.module.scss'
import Switch from '@mui/material/Switch'
import WaterWave from 'water-wave'
import 'water-wave/style.css'
import AsukaButton from '../components/asukaButton'
import { articleListGet } from '../util/article'
import { useNavigate } from "react-router-dom"
import customTips from '../util/notostack/customTips'
import $ from 'jquery'
class IndexPage extends React.Component {
    state = {
        articleList: [],
        requestInstance: {
            pageNum: 1,
            pageSize: 10
        }
    }
    componentDidMount(){
        articleListGet(this.state.requestInstance).then(resq => {
            if(resq.code === 200) {
                this.setState({
                    articleList: resq.data.list
                })
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }
    render() {
        return (
            <div className={ this.props.isMobile ? style.index_content_mobile:style.index_content }>
                <div className={style.index_sider}>
                    <header className={style.sider_header_tips}>
                        <Switch defaultChecked />
                        <span className={style.auto_play_span}>自动播放</span>
                    </header>
                    <section className={style.sider_carousel}></section>
                </div>
                <section className={style.index_section}>
                    <div className={style.public_sub_content}>
                        <span className={style.public_sub_content_header}>全部文章</span>
                        <ul className={style.article_list}>
                            {
                                this.state.articleList.map(item => {
                                    return (<Article key={item.id}  item={item}/>)
                                })
                            }
                        </ul>
                        
                    </div>
                    <div className={style.public_sub_content}>
                        <span className={style.public_sub_content_header}>最近碎语</span>
                    </div>
                </section>
            </div>
        )
    }
}
const Article = (props) => {
    const navigate = useNavigate()
    const [index, setIndex] = useState(0)
    const routerToArticle = () => {
        navigate(`detail/${props.item.id}`)
        $('#react-by-asukamis').children().stop().animate({'scrollTop': 0})
    }
    return (
        <li>
            <img src={props.item.articlePicture} title={props.item.articleTitle} alt={props.item.articleTitle} />
            <div className={style.article_info_item}>
                <p className={style.article_title}>{props.item.articleTitle}</p>
                <span className={style.article_time}>{props.item.createTime}</span>
                <p className={style.article_introduce}>{props.item.articleIntroduction}</p>
                <div className={style.article_bottom_function}>
                    <AsukaButton text='开始阅读' class='read' onClick={() => { routerToArticle() }}/>
                    <div className={style.right_article_data}>
                        <div>
                            <i className="fas fa-eye"/>
                            <span>{props.item.articleViews}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                        </div>
                        <div>
                            <i className="fas fa-heart" color={props.item.isLike ? 'error':''} />
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
export default IndexPage