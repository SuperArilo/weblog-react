import React, { useState, useEffect, useCallback, useRef } from 'react'
//样式
import style from '../assets/scss/notice.module.scss'
//方法
import $ from 'jquery'
//组件
import WaterWave from 'water-wave'
import Pagination from '../components/Pagination'
import AsukaButton from '../components/asukaButton'

export default function Notice(props) {
    //refs
    const menuNavRef = useRef(null)
    const lineRef = useRef(null)
    //params
    const [navMenuInstance, setNavMenuInstance] = useState({
        list: [
            {
                id: 0,
                title: '系统'
            },
            {
                id: 1,
                title: '@我'
            },
            {
                id: 2,
                title: '留言'
            },
            {
                id: 3,
                title: '碎语'
            },
            {
                id: 4,
                title: '赞'
            }
        ],
        selectIndex: 0
    })

    useEffect(() => {
        $(lineRef.current).width(`calc(100%/${navMenuInstance.list.length})`)
    })
    
    useEffect(() => {
        $(lineRef.current).css({ 'left': navMenuInstance.selectIndex * $(lineRef.current).width() })
    }, [navMenuInstance.selectIndex])

    return (
        <div className={style.notice_box}>
            <main className={style.notice_container}>
                <nav ref={menuNavRef} className={style.notice_container_nav}>
                    {
                        navMenuInstance.list.map(item => {
                            return (
                                <span
                                    key={item.id}
                                    className={item.id === navMenuInstance.selectIndex ? style.notice_container_nav_active:''}
                                    onClick={() => {
                                        setNavMenuInstance({
                                            ...navMenuInstance,
                                            selectIndex: item.id
                                        })
                                    }}
                                    >
                                        {item.title}
                                        <WaterWave color="rgb(155, 195, 219)" duration={ 500 } />
                                    </span>
                            )
                        })
                    }
                    <div ref={lineRef} className={style.scroll_line}></div>
                </nav>
                <div className={style.notice_function}>
                    <MentionMe />
                </div>
            </main>
        </div>
    )
}

const MentionMe = (props) => {
    return (
        <div className={style.mention_me}>
            <ul className={style.notice_data_list}>
                <li>
                    <i className='far fa-square' />
                    <span>我来给你点赞啦</span>
                    <i className='fas fa-trash' />
                </li>
            </ul>
            
            <div className={style.bottom_function}>
                <i className='far fa-square' />
                <div>
                    <Pagination
                        total={100}
                        current={1}/>
                    <AsukaButton 
                        text='删除'
                        class='danger'
                        size='small'/>
                </div>
                
            </div>
        </div>
        
    )
}