import React, { useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteIcon from '@mui/icons-material/Favorite'
import WaterWave from 'water-wave'
import style from '../assets/scss/articleDetail.module.scss'
import { useParams } from 'react-router-dom'
import Tinymce from '../components/editor'
import { articleContentGet } from '../util/article'
import customTips from '../util/notostack/customTips'
import renderHtml from '../assets/scss/renderHtml.module.scss'
import Skeleton from '@mui/material/Skeleton'
const ArticleDetail = (props) => {
    const { articleId } = useParams()
    const [ articleInstance, setArticleInstance ] = useState(null)
    return (
        <div className={style.article_detail}>
            <div className={style.article_detail_content}>
                <ArticleInfoTop articleId={articleId} getArticleData={(e) => {setArticleInstance(e)}}/>
                { articleInstance ? <Tinymce />:'' }
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
                    this.props.getArticleData(resq.data)
                }, 3000)
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
                            { this.state.articleInstance === '' ? <Skeleton variant="text" width='4rem' height='4rem' />:  <div><VisibilityIcon /><span>{this.state.articleInstance.articleViews}</span></div>}
                            { this.state.articleInstance === '' ? <Skeleton variant="text" width='4rem' height='4rem' />:  <div><FavoriteIcon /><span>{this.state.articleInstance.articleLikes}</span><WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } /></div>}
                        </div>
                    </div>
                </div>
                { this.state.articleInstance === '' ? <Skeleton variant="rounded" width='100%' height='10rem' />:<div className={`${style.article_render_content} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: this.state.articleInstance.articleContent}}></div> }
                
            </div>
        )
    }
}
export default ArticleDetail