import React, { useState, useEffect, useCallback, useRef } from 'react'
//组件
import Tinymce from '../components/editor'
import Avatar from '../components/Avatar'
import WaterWave from 'water-wave'
import { SwitchTransition, CSSTransition, TransitionGroup } from 'react-transition-group'
import Skeleton from '@mui/material/Skeleton'
import Collapse from '@mui/material/Collapse'
import AsukaPoppor from '../components/popper'
import Pagination from '../components/Pagination'
//样式
import style from '../assets/scss/guestbook.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
import '../assets/scss/currencyTransition.scss'
//方法
import { useSelector, useDispatch } from 'react-redux'
import { guestbookList, addGuestbook, deleteGuestbook } from '../util/guestbook'
import customTips from '../util/notostack/customTips'
export default function Guestbook() {
    //params
    const [dataList, setDataList] = useState(null)
    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10,
    })
    const [dataPage, setDataPage] = useState(0)
    const tinymceRef = useRef(null)
    const [addGuestbookStatus, setAddGuestbookStatus] = useState(false)
    const userInfo = useSelector((state) => state.userInfo.info)
    //function
    const dataListGet = useCallback((instance) => {
        guestbookList(instance).then(resq => {
            if(resq.code === 200) {
                setDataList(resq.data.list)
                setDataPage(resq.data.pages)
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }, [])
    useEffect(() => {
        dataListGet(requestInstance)
    }, [requestInstance, dataListGet])
    return (
        <div className={style.guestbook}>
            <Tinymce
                ref={tinymceRef}
                placeholder='在这里留下你想说的话吧...'
                status={addGuestbookStatus}
                getContent={(content) => {
                    if(content === null || content === undefined || content === '' || content === '<p></p>') {
                        customTips.warning('回复的内容不能为空白哦 (ง •_•)ง')
                        return
                    }
                    if(!addGuestbookStatus) {
                        setAddGuestbookStatus(true)
                        let data = new FormData()
                        data.append('content', content)
                        addGuestbook(data).then(resq => {
                            if(resq.code === 200) {
                                customTips.success(resq.message)
                                tinymceRef.current.clear()
                                dataListGet(requestInstance)
                            } else {
                                customTips.error(resq.message)
                            }
                            setAddGuestbookStatus(false)
                        }).catch(err => {
                            setAddGuestbookStatus(false)
                            customTips.error(err.message)
                        })
                    }
                    
                }}/>
            <div className={style.guestbook_comment_list}>
                {
                    dataList === null ? <GuestbookSkeleton />:
                    <SwitchTransition mode='out-in'>
                        <CSSTransition key={dataList.length === 0} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                            {
                                dataList.length === 0 ? <div className={style.empty_box}>当前没有留言，赶快来评论吧 ψ(｀∇´)ψ</div>:
                                <TransitionGroup>
                                    {
                                        dataList.map(item => {
                                            return (
                                                <Collapse key={item.guestbookId}>
                                                    <GuestbookCommentItem
                                                        dataListGet={dataListGet}
                                                        userInfo={userInfo}
                                                        item={item}/>
                                                </Collapse>
                                            )
                                        })
                                    }
                                </TransitionGroup>
                            }
                        </CSSTransition>
                    </SwitchTransition>
                }
            </div>
            <Pagination
                pages={dataPage}
                onPageChange={(e) => {
                    setRequestInstance({...requestInstance, pageNum: e})
                }}/>
        </div>
    )
}
const GuestbookCommentItem = (props) => {
    //params
    const [popporObject, setPopporObject] = useState({
        open: false,
        target: null,
        title: '确定要删除评论吗？ (/▽＼)'
    })
    const [deleteStatus, setDeleteStatus] = useState(false)
    return (
        <>
            <div className={style.guestbook_comment_item}>
                <header className={style.comment_item_top}>
                    <div className={style.user_info}>
                        <Avatar src={props.item.avatar} title={props.item.nickName} alt={props.item.nickName}/>
                        <div>
                            <span>{props.item.nickName}</span>
                            <span>{props.item.createTime}</span>
                        </div>
                    </div>
                    {
                        props.userInfo === null || props.userInfo.uid !== props.item.publisher ? '':
                        <i className='fas fa-trash' 
                            onClick={(e) => {
                                setPopporObject({...popporObject, open: true, target: e.target})
                            }}>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                        </i>
                    }
                </header>
                <div className={`${style.comment_html} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: props.item.content }}></div>
            </div>
            <AsukaPoppor 
                {...popporObject}
                placement='bottom-start'
                status={deleteStatus}
                onConfirm={() => {
                    if(!deleteStatus) {
                        setDeleteStatus(true)
                        let data = new FormData()
                        data.append('guestbookId', props.item.guestbookId)
                        deleteGuestbook(data).then(resq => {
                            if(resq.code === 200) {
                                customTips.success(resq.message)
                                props.dataListGet()
                            } else {
                                customTips.error(resq.message)
                            }
                            setDeleteStatus(false)
                            setPopporObject({...popporObject, open: false, target: null})
                        }).catch(err => {
                            setDeleteStatus(false)
                            customTips.error(err.message)
                            setPopporObject({...popporObject, open: false, target: null})
                        })
                    }
                }} 
                onCancel={() => { setPopporObject({...popporObject, open: false, target: null}) }}/>
        </>
    )
}
const GuestbookSkeleton = () => {
    return (
        <div className={style.guestbook_skeleton}>
            <div className={style.guestbook_skeleton_top}>
                <Skeleton variant="circular" width='2.5rem' height='2.5rem' />
                <div>
                    <Skeleton variant="text" width='6rem' sx={{ fontSize: '1.25rem' }} />
                    <Skeleton variant="text" width='4rem' sx={{ fontSize: '1.25rem' }} />
                </div>
            </div>
            <Skeleton variant="rounded" height='3rem' />
        </div>
    )
}