import React, { useEffect } from 'react'
import { withSnackbar } from 'notistack'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteIcon from '@mui/icons-material/Favorite'
import WaterWave from 'water-wave'
import style from '../assets/scss/articleDetail.module.scss'
import { useSearchParams } from 'react-router-dom'
import Tinymce from '../components/editor'
const ArticleDetail = (props) => {
    const [params] = useSearchParams()
    return (
        <div className={style.article_detail}>
            <div className={style.article_detail_content}>
                <div className={style.article_detail_top}>
                    <img className={style.article_background_image} src='' alt=''/>
                    <p className={style.article_detail_title}>
                        awdawdawdawdawdwa
                    </p>
                    <div className={style.article_data}>
                        <div className={style.data_author}>
                            <img src='' title='' alt=''/>
                            <div className={style.author_info}>
                                <span>浩浩到处跑</span>
                                <span>2022-11-07</span>
                            </div>
                        </div>
                        <div className={style.article_data_info}>
                            <div>
                                <VisibilityIcon />
                                <span>114</span>
                            </div>
                            <div>
                                <FavoriteIcon />
                                <span>114</span>
                                <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                            </div>
                        </div>
                    </div>
                    <Tinymce />
                </div>
            </div>
        </div>
    )
}
export default withSnackbar(ArticleDetail)