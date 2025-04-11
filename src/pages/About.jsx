import React from 'react'
//样式
import style from './About.module.scss'

export default function About(props) {
    return (
        <div className={style.about}>
            <ul className={style.info_box}>
                <li className={style.info_item}>
                    <span>© 2025 superarilo.icu</span>
                </li>
                <li className={style.info_item}>
                    <span>CDN By: BunnyCDN</span>
                    <img src='https://dash.bunny.net/assets/images/logo-bunnynet-icon.svg' title='BunnyCDN' alt='BunnyCDN'/>
                </li>
                <li className={style.info_item}>
                    <span>备案号: <a href='https://beian.miit.gov.cn'>蜀ICP备2021010843号</a></span>
                </li>
                <li className={style.info_item}>
                    <img src='https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png' alt='' />
                    <a href="https://beian.mps.gov.cn/#/query/webSearch?code=51142102511541" rel="noreferrer" target="_blank">川公网安备51142102511541号</a>
                </li>
            </ul>
        </div>
    )
}