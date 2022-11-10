import React from 'react'
import style from '../assets/scss/indexPage.module.scss'
import Switch from '@mui/material/Switch'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import WaterWave from 'water-wave'
import 'water-wave/style.css'
import AsukaButton from '../components/asukaButton'
import { articleListGet } from '../util/article'
import { withSnackbar } from 'notistack'
import { useNavigate } from "react-router-dom"
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
                this.props.enqueueSnackbar(resq.message, { variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'center'} })
            }
            
        }).catch(err => {
            this.props.enqueueSnackbar(err.message, { variant: 'error', autoHideDuration: 3000, anchorOrigin: { vertical: 'top', horizontal: 'center'} })
        })
    }
    render() {
        return (
            <div className={style.index_content}>
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
    const hadnleClick = (id) => {
        navigate(`detail?id=${id}`)
    }
    return (
        <li>
            <img src={props.item.articlePicture} title={props.item.articleTitle} alt={props.item.articleTitle} />
            <div className={style.article_info_item}>
                <p className={style.article_title}>{props.item.articleTitle}</p>
                <span className={style.article_time}>{props.item.createTime}</span>
                <p className={style.article_introduce}>{props.item.articleIntroduction}</p>
                <div className={style.article_bottom_function}>
                    <AsukaButton text='开始阅读' class='read' onClick={() => {hadnleClick(props.item.id)}}/>
                    <div className={style.right_article_data}>
                        <div>
                            <VisibilityIcon />
                            <span>{props.item.articleViews}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                        </div>
                        <div>
                            <FavoriteIcon color={props.item.isLike ? 'error':''} />
                            <span>{props.item.articleLikes}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                        </div>
                        <div>
                            <CommentIcon />
                            <span>{props.item.commentTotal}</span>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}
export default withSnackbar(IndexPage)