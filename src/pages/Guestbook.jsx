import React, { useState, useEffect, useCallback, useRef } from 'react'
//组件
import Tinymce from '../components/editor'
import Avatar from '../components/Avatar'
import WaterWave from '../components/WaterWave'
import { CTransitionFade, CTransitionGroup } from '../components/Transition'
import Skeleton from '@mui/material/Skeleton'
import Collapse from '@mui/material/Collapse'
import AsukaPoppor from '../components/popper'
import PreviewImage from '../components/PreviewImage'
import Pagination from '../components/Pagination'
import Svg from '../components/Icon'
//样式
import style from '../assets/scss/guestbook.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
//方法
import { useSelector } from 'react-redux'
import { guestbookList, addGuestbook, deleteGuestbook } from '../util/guestbook'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
export default function Guestbook() {
    //params
    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10,
    })
    const [dataObject, setDataObject] = useState({
        total: 0,
        pages: 1,
        list: null,
        current: 0
    })
    const tinymceRef = useRef(null)
    const [addGuestbookStatus, setAddGuestbookStatus] = useState(false)
    const userInfo = useSelector((state) => state.userInfo.info)
    //function
    const dataListGet = useCallback((instance) => {
        guestbookList(instance).then(resq => {
            if(resq.code === 200) {
                setDataObject(target => { return { ...target, list: resq.data.list, total: resq.data.total, pages: resq.data.pages, current: resq.data.current} })
            }
        }).catch(err => { })
    }, [])
    useEffect(() => {
        dataListGet(requestInstance)
    }, [requestInstance, dataListGet])
    return (
        <div className={style.guestbook}>
            <Tinymce
                userInfo={userInfo}
                ref={tinymceRef}
                placeholder='在这里留下你想说的话吧...'
                status={addGuestbookStatus}
                getContent={(content) => {
                    if(content === null || content === undefined || content === '' || content === '<p></p>') {
                        toast('回复的内容不能为空白哦 (ง •_•)ง')
                        return
                    }
                    if(!addGuestbookStatus) {
                        setAddGuestbookStatus(true)
                        let data = new FormData()
                        data.append('content', content)
                        addGuestbook({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                            if(resq.code === 200) {
                                tinymceRef.current.clear()
                                dataListGet(requestInstance)
                            }
                            setAddGuestbookStatus(false)
                        }).catch(err => {
                            setAddGuestbookStatus(false)
                        })
                    }
                    
                }}/>
            <div className={style.guestbook_comment_list}>
                <CTransitionFade
                    keyS={dataObject.list === null}
                    left={<GuestbookSkeleton />}
                    right={
                        <>
                            {
                                dataObject.list?.length === 0 ? <div className={style.empty_box}>当前没有留言，赶快来评论吧 ψ(｀∇´)ψ</div>:
                                <CTransitionGroup>
                                    {
                                        dataObject.list?.map(item => {
                                            return (
                                                <Collapse key={item.guestbookId}>
                                                    <GuestbookCommentItem
                                                        dataListGet={dataListGet}
                                                        requestInstance={requestInstance}
                                                        userInfo={userInfo}
                                                        item={item}/>
                                                </Collapse>
                                            )
                                        })
                                    }
                                </CTransitionGroup>
                            }
                        </>
                    } />
            </div>
            {
                dataObject.pages === 0 || dataObject.pages === 1 ? '':
                <Pagination
                    position='right'
                    count={dataObject.pages}
                    page={dataObject.current}
                    onPageChange={e => { setRequestInstance({...requestInstance, pageNum: e}) }}/>
            }
            
        </div>
    )
}
const GuestbookCommentItem = (props) => {
    //hook
    const navigate = useNavigate()
    //params
    const [popporObject, setPopporObject] = useState({
        open: false,
        target: null,
        title: '确定要删除评论吗？ (/▽＼)'
    })

    const renderHtmlRef = useRef(null)

    const [deleteStatus, setDeleteStatus] = useState(false)
    return (
        <>
            <div className={style.guestbook_comment_item}>
                <header className={style.comment_item_top}>
                    <div className={style.user_info}>
                        <Avatar
                            src={props.item.avatar}
                            title={props.item.nickName}
                            alt={props.item.nickName}
                            onClick={() => { navigate('/user/' + props.item.publisher) }}/>
                        <div>
                            <span>{props.item.nickName}</span>
                            <span>{props.item.createTimeFormat}</span>
                        </div>
                    </div>
                    {
                        props.userInfo === null || props.userInfo.uid !== props.item.publisher ? '':
                        <div className={style.delete_icon} onClick={(e) => { setPopporObject({...popporObject, open: true, target: e.target}) }}>
                            <Svg
                                cacheRequests={true}
                                src='https://image.superarilo.icu/svg/delete.svg'
                                width='1.1rem'
                                height='1.1rem'/>
                            <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 1 } />
                        </div>
                    }
                </header>
                <div
                    ref={renderHtmlRef}
                    className={`${style.comment_html} ${renderHtml.render_html}`}
                    dangerouslySetInnerHTML={{ __html: props.item.content }} />
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
                        deleteGuestbook({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                            if(resq.code === 200) {
                                props.dataListGet(props.requestInstance)
                            }
                            setDeleteStatus(false)
                            setPopporObject({...popporObject, open: false, target: null})
                        }).catch(err => {
                            setDeleteStatus(false)
                            setPopporObject({...popporObject, open: false, target: null})
                        })
                    }
                }} 
                onCancel={() => { setPopporObject({...popporObject, open: false, target: null}) }}/>
            <PreviewImage current={renderHtmlRef} />
        </>
    )
}
const GuestbookSkeleton = () => {
    return (
        <div>
            <div className={style.guestbook_skeleton}>
                <div className={style.guestbook_skeleton_top}>
                    <Skeleton variant="circular" width='2.5rem' height='2.5rem' />
                    <div>
                        <Skeleton variant="text" width='6rem' sx={{ fontSize: '1.25rem' }} />
                        <Skeleton variant="text" width='4rem' sx={{ fontSize: '1.25rem' }} />
                    </div>
                </div>
                <Skeleton variant="rounded" height='3.4rem' />
            </div>
            <div className={style.guestbook_skeleton}>
                <div className={style.guestbook_skeleton_top}>
                    <Skeleton variant="circular" width='2.5rem' height='2.5rem' />
                    <div>
                        <Skeleton variant="text" width='6rem' sx={{ fontSize: '1.25rem' }} />
                        <Skeleton variant="text" width='4rem' sx={{ fontSize: '1.25rem' }} />
                    </div>
                </div>
                <Skeleton variant="rounded" height='3.4rem' />
            </div>
            <div className={style.guestbook_skeleton}>
                <div className={style.guestbook_skeleton_top}>
                    <Skeleton variant="circular" width='2.5rem' height='2.5rem' />
                    <div>
                        <Skeleton variant="text" width='6rem' sx={{ fontSize: '1.25rem' }} />
                        <Skeleton variant="text" width='4rem' sx={{ fontSize: '1.25rem' }} />
                    </div>
                </div>
                <Skeleton variant="rounded" height='3.4rem' />
            </div>
        </div>
    )
}