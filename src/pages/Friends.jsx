import React, { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'

import Avatar from '../components/Avatar'

import style from '../assets/scss/friends.module.scss'

export default function Friends(props) {
    return (
        <div className={style.friends_box}>
            <ul className={style.friends_list}>
                <li>
                    <Avatar
                        src='http://139.155.94.20:3090/image/a06b0cfe-0fa0-454f-8a3c-e55ada437859.png'
                        width='3rem'
                        height='3rem'
                        />
                    <span className={style.friend_name}>这次换你听歌</span>
                    <span className={style.time_ago}>3天前来过</span>
                </li>
                <li>
                    <Avatar
                        src='http://139.155.94.20:3090/image/a06b0cfe-0fa0-454f-8a3c-e55ada437859.png'
                        width='3rem'
                        height='3rem'
                        />
                    <span className={style.friend_name}>这次换你听歌</span>
                    <span className={style.time_ago}>3天前来过</span>
                </li>
                <li>
                    <Avatar
                        src='http://139.155.94.20:3090/image/a06b0cfe-0fa0-454f-8a3c-e55ada437859.png'
                        width='3rem'
                        height='3rem'
                        />
                    <span className={style.friend_name}>这次换你听歌</span>
                    <span className={style.time_ago}>3天前来过</span>
                </li>
                <li>
                    <Avatar
                        src='http://139.155.94.20:3090/image/a06b0cfe-0fa0-454f-8a3c-e55ada437859.png'
                        width='3rem'
                        height='3rem'
                        />
                    <span className={style.friend_name}>这次换你听歌</span>
                    <span className={style.time_ago}>3天前来过</span>
                </li>
            </ul>
        </div>
    )
}