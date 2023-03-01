import React, { useState, useEffect, useCallback, useRef } from 'react'
//样式
import style from '../assets/scss/notice.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
import '../assets/scss/currencyTransition.scss'
//方法
import $ from 'jquery'
import { noticeGet, readNotice } from '../util/notice'
import customTips from '../util/notostack/customTips'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate  } from 'react-router-dom'
import { TransitionGroup, SwitchTransition, CSSTransition } from 'react-transition-group'
//组件
import WaterWave from 'water-wave'
import Pagination from '../components/Pagination'
import AsukaButton from '../components/asukaButton'
import { Collapse } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

export default function Notice(props) {

    //hook
    const navigate = useNavigate()

    //refs
    const menuNavRef = useRef(null)
    const lineRef = useRef(null)
    
    //params
    const [navMenuInstance, setNavMenuInstance] = useState({
        list: [
            {
                id: 1,
                title: '系统'
            },
            {
                id: 2,
                title: '@我'
            },
            {
                id: 3,
                title: '留言'
            },
            {
                id: 4,
                title: '碎语'
            },
            {
                id: 5,
                title: '赞'
            }
        ],
        selectIndex: 0,
        selectItemIndex: null
    })
    const userInfo = useSelector((state) => state.userInfo.info)
    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10,
        classType: 1
    })

    const [noticeInstance, setNoticeInstance] = useState({
        pages: 0,
        total: 0,
        current: 1,
        size: 0,
        list: null
    })

    const [selectNoticeList, setSelectNoticeList] = useState([])

    const noticeListGet = useCallback(instance => {
        noticeGet(instance).then(resq => {
            if(resq.code === 200) {
                setNoticeInstance(current => ({
                    ...current,
                    list: resq.data.list,
                    pages: resq.data.pages,
                    total: resq.data.total,
                    current: resq.data.current,
                    size: resq.data.size
                }))
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }, [])

    useEffect(() => {
        if(userInfo === null) {
            navigate('/')
        }
    }, [userInfo, navigate])

    useEffect(() => {
        noticeListGet(requestInstance)
    }, [requestInstance, noticeListGet])

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
                        navMenuInstance.list.map((item, index, array)=> {
                            return (
                                <span
                                    key={item.id}
                                    className={index === navMenuInstance.selectIndex ? style.notice_container_nav_active:''}
                                    onClick={() => {
                                        if(index === navMenuInstance.selectIndex) return
                                        setNoticeInstance({
                                            ...noticeInstance,
                                            total: 0,
                                            size: 0,
                                            current: 1,
                                            pages: 0,
                                            list: null
                                        })
                                        setNavMenuInstance({
                                            ...navMenuInstance,
                                            selectIndex: index,
                                            selectItemIndex: null
                                        })
                                        setRequestInstance({
                                            ...requestInstance,
                                            classType: item.id
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
                <SwitchTransition mode='out-in'>
                    <CSSTransition key={noticeInstance.list === null} timeout={300} classNames="change" nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                        {
                            noticeInstance.list === null ?
                            <div className={style.notice_data_skeleton}>
                                <Stack spacing={1}>
                                    <Skeleton variant="rounded" width='100%' height='2rem' />
                                    <Skeleton variant="rounded" width='100%' height='2rem' />
                                    <Skeleton variant="rounded" width='100%' height='2rem' />
                                </Stack>
                                
                            </div>
                            :
                            <>
                                {
                                    noticeInstance.list.length === 0 ?
                                    <span className={style.notice_data_empty}>当前没有任何通知哦</span>
                                    :
                                    <>
                                        <ul className={style.notice_data_list}>
                                        {
                                            noticeInstance.list.map((item, index, array) => {
                                                return (
                                                    <li key={item.noticeId}>
                                                        <div className={style.notice_title}>
                                                            <i className={`${'far'} ${selectNoticeList.indexOf(item.noticeId) === -1 ? 'fa-square':'far fa-check-square'}`}
                                                                onClick={() => {
                                                                    let copy = [...selectNoticeList]
                                                                    let index = copy.indexOf(item.noticeId)
                                                                    if(index === -1) {
                                                                        copy.push(item.noticeId)
                                                                    } else {
                                                                        copy.splice(index, 1)
                                                                    }
                                                                    setSelectNoticeList(copy)
                                                                }}/>
                                                            <span onClick={() => { setNavMenuInstance({...navMenuInstance, selectItemIndex: navMenuInstance.selectItemIndex === item.noticeId ? null:item.noticeId}) }}>{item.title}</span>
                                                            <i className='fas fa-trash' />
                                                        </div>
                                                        <Collapse in={navMenuInstance.selectItemIndex === item.noticeId} mountOnEnter unmountOnExit>
                                                            <div
                                                                className={`${style.notice_content} ${renderHtml.render_html}`}
                                                                dangerouslySetInnerHTML={{ __html: item.content }}/>
                                                        </Collapse>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    <div className={style.bottom_function}>
                                        <div className={style.select_all}>
                                            <i 
                                                className={`${'far'} ${selectNoticeList.length === 0 ? 'fa-square':''} ${selectNoticeList.length >= 1 && selectNoticeList.length < noticeInstance.list.length ? 'fa-minus-square':''} ${selectNoticeList.length === noticeInstance.list.length ? 'fa-check-square':''}`} 
                                                onClick={() => {
                                                    if(selectNoticeList.length === noticeInstance.list.length) {
                                                        setSelectNoticeList([])
                                                        return
                                                    }
                                                    let [...list] = selectNoticeList
                                                    noticeInstance.list.forEach(key => {
                                                        if(selectNoticeList.indexOf(key.noticeId) === -1) {
                                                            list.push(key.noticeId)
                                                        }
                                                    })
                                                    setSelectNoticeList(list)
                                                }}/>
                                            <span>全选</span>
                                        </div>
                                        <div>
                                            {
                                                noticeInstance.list.length !== 0 &&
                                                <Pagination
                                                    total={noticeInstance.total}
                                                    current={noticeInstance.current}
                                                    onPageChange={e => { setRequestInstance({...requestInstance, pageNum: e}) }}/>
                                            }
                                            <AsukaButton 
                                                text='删除'
                                                class='read'
                                                size='small'
                                                onClick={() => {
                                                    let data = new FormData()
                                                    data.append('noticeIds', selectNoticeList)
                                                    readNotice(data).then(resq => {
                                                        if(resq.code === 200)  {
                                                            noticeListGet(requestInstance)
                                                            customTips.success(resq.message)
                                                            setSelectNoticeList([])
                                                        } else {
                                                            customTips.error(resq.message)
                                                        }
                                                    }).catch(err => {
                                                        customTips.error(err.message)
                                                    })
                                                }}/>
                                        </div>
                                    </div>
                                    </>
                                }
                            </>
                        }
                    </CSSTransition>
                </SwitchTransition>
                    
                    
                </div>
            </main>
        </div>
    )
}