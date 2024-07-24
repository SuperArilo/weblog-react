import React from 'react'
//样式
import style from './About.module.scss'

export default function About(props) {
    return (
        <div className={style.about}>
            <ul className={style.info_box}>
                <li className={style.info_item}>
                    <span>© 2023 superarilo.icu All Rights Reserved.</span>
                </li>
                <li className={style.info_item}>
                    <span>CDN By: BunnyCDN</span>
                    <img src='https://dash.bunny.net/assets/images/logo-bunnynet-icon.svg' title='BunnyCDN' alt='BunnyCDN'/>
                </li>
            </ul>
        </div>
    )
}