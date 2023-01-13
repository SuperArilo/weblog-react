import React, { useState, useEffect, useCallback } from 'react'
//组件
import Tinymce from '../components/editor'
import Avatar from '../components/Avatar'
import WaterWave from 'water-wave'
import { SwitchTransition, CSSTransition, TransitionGroup } from 'react-transition-group'
import Skeleton from '@mui/material/Skeleton'
import Collapse from '@mui/material/Collapse'
import AsukaPoppor from '../components/popper'
//样式
import style from '../assets/scss/guestbook.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
import '../assets/scss/currencyTransition.scss'
//方法
import { guestbookList } from '../util/guestbook'
import customTips from '../util/notostack/customTips'
export default function Guestbook() {
    //params
    const [dataList, setDataList] = useState(null)
    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10,
    })
    useEffect(() => {
        guestbookList(requestInstance).then(resq => {
            if(resq.code === 200) {
                setTimeout(() => {
                    setDataList(resq.data.list)
                }, 1000)
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }, [requestInstance])
    return (
        <div className={style.guestbook}>
            <Tinymce 
                placeholder='在这里留下你想说的话吧...' />
            <div className={style.guestbook_comment_list}>
                {
                    dataList === null ? <GuestbookSkeleton />:
                    <SwitchTransition mode='out-in'>
                        <CSSTransition key={dataList === 0} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                            {
                                dataList.length === 0 ? <span>none</span>:
                                <TransitionGroup>
                                    {
                                        dataList.map(item => {
                                            return (
                                                <Collapse key={item.guestbookId}>
                                                    <GuestbookCommentItem setDataList={setDataList} item={item}/>
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
        </div>
    )
}
const GuestbookCommentItem = (props) => {
    const [popporObject, setPopporObject] = useState({
        open: false,
        target: null
    })
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
                    <i className='fas fa-trash' 
                        onClick={(e) => {
                            setPopporObject({...popporObject, open: true, target: e.target})
                        }}>
                        <WaterWave color="rgba(0, 0, 0, 0.7)" duration={ 500 } />
                    </i>
                </header>
                <div className={`${style.comment_html} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: props.item.content }}></div>
            </div>
            <AsukaPoppor 
                {...popporObject}
                title='确定要删除评论吗？ (/▽＼)' 
                placement='bottom-start' 
                onConfirm={() => { 
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