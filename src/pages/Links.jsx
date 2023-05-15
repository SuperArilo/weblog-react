import React, { useState, useEffect, useCallback, useRef } from 'react'
//样式
import style from '../assets/scss/links.module.scss'
import renderHtml from '../assets/scss/renderHtml.module.scss'
import '../assets/scss/currencyTransition.scss'
//组件
import Avatar from '../components/Avatar'
import TextField from '@mui/material/TextField'
import AsukaButton from '../components/asukaButton'
import { SwitchTransition, CSSTransition, TransitionGroup } from 'react-transition-group'
import Skeleton from '@mui/material/Skeleton'
//方法
import { useSelector, useDispatch } from 'react-redux'
import { friendList, linksApply } from '../util/links'
import toast from 'react-hot-toast'

export default function Links(props) {

    //params
    const [tempContent, setTempContent] = useState('<div data-v-76481dbc=""><div data-v-76481dbc="">如果要和本站交换友链，请按照以下格式提交</div></div><div data-v-76481dbc=""><div data-v-76481dbc="">博客名字: xxxxxx</div><div data-v-76481dbc="">博客地址: https://example.com</div><div data-v-76481dbc="">博客简介: xxxxxxxxx</div><div data-v-76481dbc="">博客头像: https://example.com/avatar.jpg</div></div><hr class="v-divider theme--light" role="separator" data-v-76481dbc="" aria-orientation="horizontal"><div data-v-76481dbc=""><div class="caption font-italic" data-v-76481dbc=""><em>注① : 希望你的网站非采集以及纯技术站点，且每三个月至少有一次更新。</em></div><div class="caption font-italic" data-v-76481dbc=""><em>注② : 为了更快的效率，请提前加上我的友链，我会在一天内尽快给出答复，谢谢！</em></div></div>') 
    
    const userInfo = useSelector((state) => state.userInfo.info)

    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10
    })
    const [dataInstance, setDataInstance] = useState({
        pages: 0,
        size: 0,
        total: 0,
        current: 0,
        list: null
    })
    const [blogInstance, setBlogInstance] = useState({
        blogName: '',
        blogLocation: '',
        blogIntroduction: '',
        blogAvatar: ''
    })
    const [applyStatus, setApplyStatus] = useState(false)

    const friendListGet = useCallback(instance => {
        friendList(instance).then(resq => {
            if(resq.code === 200) {
                setDataInstance(current => ({
                    ...current,
                    pages: resq.data.pages,
                    size: resq.data.size,
                    current: resq.data.current,
                    list: resq.data.list
                }))
            } else {
                toast.error(resq.message)
            }
        }).catch(err => {
            toast.error(err.message)
        })
    }, [])

    useEffect(() => {
        friendListGet(requestInstance)
    }, [friendListGet, requestInstance])

    return (
        <div className={style.link_page}>
            {
                userInfo !== null &&
                <div className={style.apply_content}>
                    <p className={style.function_title}>申请规则</p>
                    <div className={`${style.apply_html} ${renderHtml.render_html}`} dangerouslySetInnerHTML={{ __html: tempContent }} />
                    <div className={style.apply_info}>
                        <div className={style.apply_input_list}>
                            <div className={style.input_item}>
                                <TextField
                                    label="博客名字"
                                    variant="standard"
                                    size="small"
                                    fullWidth 
                                    onChange={e => { setBlogInstance({...blogInstance, blogName: e.target.value}) }}/>
                            </div>
                            <div className={style.input_item}>
                                <TextField
                                    label="博客地址"
                                    variant="standard"
                                    size="small"
                                    fullWidth 
                                    onChange={e => { setBlogInstance({...blogInstance, blogLocation: e.target.value}) }}/>
                            </div>
                            <div className={style.input_item}>
                                <TextField
                                    label="博客简介"
                                    variant="standard"
                                    size="small"
                                    fullWidth
                                    onChange={e => { setBlogInstance({...blogInstance, blogIntroduction: e.target.value}) }}/>
                            </div>
                            <div className={style.input_item}>
                                <TextField
                                    label="博客头像"
                                    variant="standard"
                                    size="small"
                                    fullWidth 
                                    onChange={e => { setBlogInstance({...setBlogInstance, blogAvatar: e.target.value}) }}/>
                            </div>
                            <div className={style.input_item} />
                            <div className={style.input_item}>
                                <AsukaButton
                                    text='提交'
                                    status={applyStatus}
                                    size='small'
                                    onClick={() => {
                                        if(blogInstance.blogAvatar === '' || blogInstance.blogIntroduction === '' || blogInstance.blogLocation === '' || blogInstance.blogName === '') {
                                            toast('填写的信息为空哦')
                                            return
                                        }
                                        if(!applyStatus) {
                                            const id = toast.loading('提交中...')
                                            setApplyStatus(true)
                                            linksApply(blogInstance).then(resq => {
                                                if(resq.code === 200) {
                                                    toast.success(resq.message, { id: id })
                                                } else {
                                                    toast.error(resq.message, { id: id })
                                                }
                                                setApplyStatus(false)
                                            }).catch(err => {
                                                toast.error(err.message, { id: id })
                                                setApplyStatus(false)
                                            })
                                        }
                                    }}/>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className={style.friends_content}>
                <p className={style.function_title}>朋友们 (默认按添加时间排序)</p>
                <div className={style.friends_list}>
                    <SwitchTransition mode='out-in'>
                        <CSSTransition key={dataInstance.list === null} classNames='change' timeout={300} nodeRef={null} mountOnEnter={true} unmountOnExit={true}>
                            {
                                dataInstance.list === null ?
                                <LinksSkeleton />
                                :
                                <>
                                    {
                                        dataInstance.list.length === 0 ?
                                        <div className={style.friends_list_item_skeleton}>
                                            <span className={style.empty_box}>一个朋友都没有 o(TヘTo)</span>
                                        </div>
                                        :
                                        dataInstance.list.map(item => {
                                            return (
                                                <div className={style.friends_list_item} key={item.id}>
                                                    <Avatar 
                                                        width='3.2rem'
                                                        height='3.2rem'
                                                        src={item.friendAvatar}/>
                                                    <div className={style.friends_info}>
                                                        <span className={style.friends_name}>{item.friendName}</span>
                                                        <p className={style.friends_describe}>{item.friendIntroduction}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </>
                            }
                        </CSSTransition>
                    </SwitchTransition>
                    
                </div>
            </div>
        </div>
    )
}
const LinksSkeleton = () => {
    return (
        <div className={style.friends_list_item_skeleton}>
            <Skeleton variant="circular" width='3.2rem' height='3.2rem' />
            <div className={style.friends_info}>
                <Skeleton variant="text" width='90%' sx={{ fontSize: '1.25rem' }} />
                <Skeleton variant="text" width='50%' sx={{ fontSize: '1.25rem' }} />
            </div>
        </div>
    )
}