import React, { useState, useEffect, useCallback, useRef } from 'react'
//样式
import style from './User.module.scss'
import Theme from './User.Theme.module.scss'
//方法
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useParams } from "react-router-dom"
import $ from 'jquery'
import { blogUserProfiles, blogUserProfilesModify } from '../api/User.js'
import { userlikesListGet, targetLikeUser } from '../api/UserLike.js'
import { modifyEmail } from '../api/Mail.js'
import toast from 'react-hot-toast'
//组件
import { CTransitionFade, CTransitionGroup } from '../components/Transition'
import Gossip from './Gossip'
import Collapse from '@mui/material/Collapse'
import Avatar from '../components/Avatar'
import WaterWave from '../components/WaterWave'
import Button from '../components/Button'
import Icon from '../components/Icon'
import InstantInput from '../components/InstantInput'
import AvatarCut from '../components/AvatarCut'
import Skeleton from '@mui/material/Skeleton'
import Svg from '../components/Svg.jsx'

export default function User(props) {

    //hook
    const dispatch = useDispatch()

    //params
    const userInfo = useSelector((state) => state.userInfo.info, shallowEqual)
    const [userProfiles, setUserProfiles] = useState(null)
    const { viewUid } = useParams()
    //theme
    const isDark = useSelector(state => state.theme.isDark)
    const avatarCutRef = useRef(null)

    const [modeInstance, setModeInstance] = useState({
        menuIndex: 0,
        status: false,
        editorIndex: null,
        loadingStatus: false,
        tempAvatar: null,
        instance: null
    })

    //info
    const [infoMenuList, setInfoMenuList] = useState([
        {
            id: 0,
            title: '资料',
            svgSrc: 'Info'
        },
        {
            id: 1,
            title: '碎语',
            svgSrc: 'Gossip'
        },
        {
            id: 2,
            title: '点赞',
            svgSrc: 'Ulike'
        },
        {
            id: 3,
            title: '留言',
            svgSrc: 'Contact'
        }
    ])
    //editor
    const [editorMenuList, setEditorMenuList] = useState([
        {
            id: 0,
            title: '资料',
            icon: 'Info'
        },
        {
            id: 1,
            title: '账号',
            icon: 'Avatar'
        },
        {
            id: 2,
            title: '设置',
            icon: 'Setting'
        }
    ])

    //ref
    const menuLineRef = useRef(null)

    const queryProfiles = useCallback(params => {
        blogUserProfiles({ data: params, toast: null }).then(resq => {
            if(resq.code === 200) {
                setUserProfiles(resq.data)
                if(resq.data == null) return
                if(parseInt(params) === userInfo?.uid) {
                    setTimeout(() => {
                        dispatch({ type: 'userInfo/setAvatar', payload: resq.data.avatar })
                    }, 0)
                    // setTimeout(() => {
                    //     dispatch({ type: 'userInfo/setBackground', payload: resq.data.background })
                    // }, 0)
                }
                // $('#react-by-asukamis').css({ 'backgroundImage': 'url(' + resq.data.background + ')' })
            } else {
                toast.error(resq.message)
            }
        }).catch(err => {
            toast.error(err.message)
        })
    }, [dispatch, userInfo?.uid])

    useEffect(() => {
        queryProfiles(viewUid)
    }, [viewUid, queryProfiles])

    useEffect(() => {
        if(modeInstance.instance === null) return
        blogUserProfilesModify({ data: modeInstance.instance, toast: { isShow: true, loadingMessage: '修改中...' } }).then(resq => {
            if(resq.code === 200) {
                queryProfiles(viewUid)
                setModeInstance(current => ({
                    ...current,
                    loadingStatus: false,
                    editorIndex: null,
                    instance: null,
                    tempAvatar: null
                }))
            } else {
                setModeInstance(current => ({
                    ...current,
                    loadingStatus: false,
                    instance: null
                }))
            }
        }).catch(err => {
            setModeInstance(current => ({
                ...current,
                loadingStatus: false,
                instance: null
            }))
        })
    }, [modeInstance.instance, queryProfiles, viewUid])

    useEffect(() => {
        if(userInfo === null) {
            setModeInstance(current => ({
                ...current,
                status: false,
                loadingStatus: false,
                editorIndex: null,
                instance: null,
                tempAvatar: null
            }))
        }
    }, [userInfo])

    // //销毁
    // useEffect(() => {
    //     return () => {
    //         if (userInfo === null) {
    //             $('#react-by-asukamis').css({ 'backgroundImage': 'url(https://image.superarilo.icu/defalut_bg.jpg)' })
    //         } else {
    //             $('#react-by-asukamis').css({ 'backgroundImage': 'url(' + userInfo.background + ')' })
    //         }
    //     }
    //   }, [userInfo])

    return (
        <div className={`${style.user_info} ${isDark ? Theme.dark_user_info:Theme.light_user_info}`}>
            <CTransitionFade
                keyS={userProfiles === null}
                left={<UserSkeleton />}
                right={
                    <div className={`${style.info_box} ${Theme.info_box}`}>
                        <div className={`${style.user_head_box} ${Theme.user_head_box}`}>
                            <div className={style.user_avatar_box}>
                                {
                                    modeInstance.tempAvatar !== null ?
                                    <AvatarCut
                                        ref={avatarCutRef}
                                        image={modeInstance.tempAvatar}/>
                                    :
                                    <Avatar
                                        width='3.8rem'
                                        height='3.8rem'
                                        src={userProfiles?.avatar}
                                        title={userProfiles?.nickName}
                                        alt={userProfiles?.nickName}/>
                                }
                                {
                                    modeInstance.status ?
                                    <>
                                        <div className={style.avatar_box_button}>
                                        <Button
                                            clazz='file'
                                            text='上传头像'
                                            getFile={file => {
                                                setModeInstance({...modeInstance, tempAvatar: file})
                                            }}/>
                                        {
                                            modeInstance.tempAvatar !== null ? 
                                            <>
                                                <Button
                                                    status={modeInstance.loadingStatus}
                                                    text='提交'
                                                    onClick={() => {
                                                        if(!modeInstance.loadingStatus) {
                                                            avatarCutRef.current.getImage().current.getImageScaledToCanvas().toBlob((blob) => {
                                                                setModeInstance(current => ({
                                                                    ...current,
                                                                    loadingStatus: true,
                                                                    instance: {
                                                                        ...current.instance,
                                                                        avatar: new File([blob], 'transform.png')
                                                                    }
                                                                }))
                                                                return
                                                            })
                                                        }
                                                    }}/>
                                                <Button
                                                    text='退出'
                                                    clazz='danger'
                                                    onClick={() => {
                                                        setModeInstance({...modeInstance, tempAvatar: null})
                                                    }}/>
                                            </>
                                            : null
                                        }
                                        
                                    </div>
                                    </>
                                    : ''
                                }
                                
                            </div>
                            <div className={`${style.public_info_item} ${Theme.public_info_item}`} eidtorindex='0'>
                                {
                                    modeInstance.editorIndex === '0' ?
                                    <InstantInput
                                        label='昵称'
                                        onErrorMessage='必填项'
                                        handleClose={() => { setModeInstance({...modeInstance, editorIndex: null}) }}
                                        value={userProfiles.nickName}
                                        loadingStatus={modeInstance.loadingStatus}
                                        handleSave={content => {
                                            if(!modeInstance.loadingStatus) {
                                                setModeInstance(current => ({
                                                    ...current,
                                                    loadingStatus: true,
                                                    instance: {
                                                        ...current.instance,
                                                        nickName: content
                                                    }
                                                }))
                                            }
                                        }}/>
                                    :
                                    <>
                                        <p className={`${style.nick_name} ${Theme.nick_name}`}>{userProfiles?.nickName}</p>
                                        {
                                            modeInstance.status && <Icon 
                                                                        name='Editor'
                                                                        width='1.2rem'
                                                                        height='1.2rem'
                                                                        onClick={e => {
                                                                            setModeInstance({...modeInstance, editorIndex: $(e.currentTarget).parent().attr('eidtorindex')})
                                                                        }}/>
                                        }
                                    </>
                                }
                                
                            </div>
                            <div className={`${style.public_info_item} ${Theme.public_info_item}`} eidtorindex='1'>
                                {
                                    modeInstance.editorIndex === '1' ?
                                    <InstantInput
                                        width='18rem'
                                        mode='textarea'
                                        label='个性签名'
                                        onErrorMessage='必填项'
                                        value={userProfiles.autograph}
                                        loadingStatus={modeInstance.loadingStatus}
                                        handleClose={() => { setModeInstance({...modeInstance, editorIndex: null}) }}
                                        handleSave={content => {
                                            if(!modeInstance.loadingStatus) {
                                                setModeInstance(current => ({
                                                    ...current,
                                                    loadingStatus: true,
                                                    instance: {
                                                        ...current.instance,
                                                        autograph: content
                                                    }
                                                }))
                                            }
                                        }}/>
                                    :
                                    <>
                                        <span className={style.autograph}>{userProfiles?.autograph}</span>
                                        {
                                            modeInstance?.status && <Icon 
                                                                        name='Editor'
                                                                        width='1.2rem'
                                                                        height='1.2rem'
                                                                        onClick={e => {
                                                                            setModeInstance({...modeInstance, editorIndex: $(e.currentTarget).parent().attr('eidtorindex')})
                                                                        }}/>
                                        }
                                    </>
                                }
                            </div>
                            {
                                parseInt(userInfo?.uid) !== parseInt(viewUid) ?
                                null
                                :
                                <Button 
                                    text={modeInstance.status ? '退出编辑模式':'编辑个人资料'}
                                    clazz={modeInstance.status ? 'danger':'normal'}
                                    onClick={() => {
                                        setModeInstance({...modeInstance, status: !modeInstance.status, editorIndex: null, menuIndex: 0})
                                        $(menuLineRef.current).css({ left: 0 })
                                    }}/>
                            }
                            {
                                modeInstance.status === false &&
                                <div
                                    className={`${style.likes_box} ${Theme.likes_box}`}
                                    onClick={() => {
                                        if(userInfo == null) {
                                            toast('需要登录才能继续！')
                                            return
                                        }
                                        let data = new FormData()
                                        data.append('targetUid', viewUid)
                                        targetLikeUser({ data: data, toast: { isShow: true, loadingMessage: '提交请求中...' } }).then(resq => {
                                            setUserProfiles(current => ({
                                                ...current,
                                                likeNum: resq.data.status ? userProfiles.likeNum + 1:userProfiles.likeNum - 1,
                                                viewerLike: resq.data.status
                                            }))
                                        }).catch(() => {})
                                    }}>
                                    <Svg
                                        name='User_like'
                                        className={userProfiles?.viewerLike ? style.user_like_on:''}
                                        style={{
                                            width: '1.2rem',
                                            height: '1.2rem'
                                        }} />
                                    <span>{userProfiles?.likeNum}</span>
                                    <WaterWave position='absolute' />
                                </div>
                            }
                        </div>
                        <div className={`${style.function_box} ${Theme.function_box}`}>
                            <header className={`${style.select_title} ${Theme.select_title}`}>
                                <div ref={menuLineRef} className={style.select_line} style={{ width: 'calc(100% / ' + (modeInstance.status ? editorMenuList.length:infoMenuList.length) + ')' }} type='line' />
                                {
                                    modeInstance.status ?
                                    editorMenuList.map(item => {
                                        return (
                                            <div
                                                className={`${style.select_title_item} ${Theme.select_title_item} ${modeInstance.menuIndex === item.id ? style.select_title_item_active:''}`}
                                                index={item.id}
                                                key={item.id}
                                                onClick={() => {
                                                    setModeInstance({...modeInstance, menuIndex: item.id})
                                                    $(menuLineRef.current).css({ left: $($('div[index]')[item.id]).width() * item.id })
                                                }}>
                                                <Svg
                                                    name={item.icon}
                                                    style={{
                                                        width: '1.2rem',
                                                        height: '1.2rem'
                                                    }} />
                                                <span>{item.title}</span>
                                                <WaterWave color="rgb(155, 195, 219)" duration={ 1 } />
                                            </div>
                                        )
                                    })
                                    :
                                    infoMenuList.map(item => {
                                        return (
                                            <div
                                                className={`${style.select_title_item} ${Theme.select_title_item} ${modeInstance.menuIndex === item.id ? Theme.select_title_item_active:''}`}
                                                index={item.id}
                                                key={item.id}
                                                onClick={() => {
                                                    setModeInstance({...modeInstance, menuIndex: item.id})
                                                    $(menuLineRef.current).css({ left: $($('div[index]')[item.id]).width() * item.id })
                                                }}>
                                                <Svg
                                                    name={item.svgSrc}
                                                    style={{
                                                        width: '1.2rem',
                                                        height: '1.2rem'
                                                    }} />
                                                <span>{item.title}</span>
                                                <WaterWave color="rgb(155, 195, 219)" duration={ 1 } />
                                            </div>
                                        )
                                    })
                                }
                            </header>
                            <div className={`${style.select_function_box} ${Theme.select_function_box}`}>
                                {
                                    modeInstance.status ? 
                                    <RenderEditorFunctionView
                                        modeInstance={modeInstance}
                                        setModeInstance={setModeInstance}
                                        userProfiles={userProfiles}
                                        userInfo={userInfo}
                                        viewUid={viewUid} />
                                    :
                                    <RenderFunctionView
                                        menuIndex={modeInstance.menuIndex}
                                        userProfiles={userProfiles}
                                        userInfo={userInfo}
                                        viewUid={viewUid} />
                                }
                            </div>
                        </div>
                    </div>
                } />
        </div>
    )
}
const UserInfoView = (props) => {
    return (
        <ul className={`${style.user_info_view} ${Theme.user_info_view}`}>
            <li>
                <div className={`${style.info_title} ${Theme.info_title}`}>
                    <Svg
                        name='Ucontact'
                        style={{
                            width: '1.2rem',
                            height: '1.2rem'
                        }} />
                    <span>联系方式</span>
                </div>
                <div className={`${style.info_content} ${Theme.info_content}`} editorindex='3'>
                    {
                        props.modeInstance?.editorIndex === '3' ?
                        <InstantInput
                            width='12rem'
                            mode='input'
                            label='联系方式'
                            value={props.userProfiles.contact}
                            loadingStatus={props.modeInstance.loadingStatus}
                            handleClose={() => { props.setModeInstance({...props.modeInstance, editorIndex: null}) }}
                            handleSave={content => {
                                if(!props.modeInstance.loadingStatus) {
                                    props.setModeInstance({
                                        ...props.modeInstance, 
                                        loadingStatus: true,
                                        instance: {
                                            ...props.modeInstance.instance,
                                            contact: content
                                        }
                                    })
                                }
                            }}/>
                        :
                        <>
                            {
                                props.modeInstance?.status ?
                                <>
                                    <span>{props.userProfiles.contact}</span>
                                    <Icon
                                        name='Editor'
                                        width='1.2rem'
                                        height='1.2rem'
                                        onClick={e => {
                                            props.setModeInstance({...props.modeInstance, editorIndex: $(e.currentTarget).parent().attr('editorindex')})
                                        }} />
                                    </>
                                :
                                <span>{props.userProfiles.contact}</span>
                            }
                        </>
                    }
                </div>
            </li>
            <li>
                <div className={`${style.info_title} ${Theme.info_title}`}>
                    <Svg
                        name='Calendar'
                        style={{
                            width: '1.2rem',
                            height: '1.2rem'
                        }} />
                    <span>注册时间</span>
                </div>
                <div className={`${style.info_content} ${Theme.info_content}`}>
                    <span>{props.userProfiles.registerTime}</span>
                </div>
            </li>
            <li>
                <div className={`${style.info_title} ${Theme.info_title}`}>
                    <Svg
                        name='Identity'
                        style={{
                            width: '1.2rem',
                            height: '1.2rem'
                        }} />
                    <span>身份标签</span>
                </div>
                <div className={`${style.info_content} ${Theme.info_content}`}>
                    <span>{props.userProfiles.category}</span>
                </div>
            </li>
            <li>
                <div className={`${style.info_title} ${Theme.info_title}`}>
                    <Svg
                        name='Age'
                        style={{
                            width: '1.2rem',
                            height: '1.2rem'
                        }} />
                    <span>年龄</span>
                </div>
                <div className={`${style.info_content} ${Theme.info_content}`} editorindex='4'>
                    {
                        props.modeInstance?.editorIndex === '4' ?
                        <InstantInput
                            width='8rem'
                            mode='input'
                            label='年龄'
                            value={props.userProfiles.age}
                            loadingStatus={props.modeInstance.loadingStatus}
                            handleClose={() => { props.setModeInstance({...props.modeInstance, editorIndex: null}) }}
                            handleSave={content => {
                                if(!props.modeInstance.loadingStatus) {
                                    props.setModeInstance({
                                        ...props.modeInstance, 
                                        loadingStatus: true,
                                        instance: {
                                            ...props.modeInstance.instance,
                                            age: content
                                        }
                                    })
                                }
                            }}/>
                        :
                        <>
                            {
                                props.modeInstance?.status ?
                                <>
                                    <span>{props.userProfiles.age}</span>
                                    <Icon
                                        name='Editor'
                                        width='1.2rem'
                                        height='1.2rem'
                                        onClick={e => {
                                            props.setModeInstance({...props.modeInstance, editorIndex: $(e.currentTarget).parent().attr('editorindex')})
                                        }}/>
                                </>
                                :
                                <span>{props.userProfiles.age}</span>
                            }
                        </>
                    }
                </div>
            </li>
            <li>
                <div className={`${style.info_title} ${Theme.info_title}`}>
                    <Svg
                        name='Sex'
                        style={{
                            width: '1.2rem',
                            height: '1.2rem'
                        }} />
                    <span>性别</span>
                </div>
                <div className={`${style.info_content} ${Theme.info_content}`} editorindex='5'>
                    {
                        props.modeInstance?.editorIndex === '5' ?
                        <InstantInput
                            width='8rem'
                            mode='select'
                            label='性别'
                            value={props.userProfiles.sex}
                            renderObject={[{ id: 0, title: '女' }, { id: 1, title: '男' }, { id: 3, title: '未设置' }]}
                            loadingStatus={props.modeInstance.loadingStatus}
                            handleClose={() => { props.setModeInstance({...props.modeInstance, editorIndex: null}) }}
                            handleSave={content => {
                                if(!props.modeInstance.loadingStatus) {
                                    props.setModeInstance({
                                        ...props.modeInstance,
                                        loadingStatus: true,
                                        instance: {
                                            ...props.modeInstance.instance,
                                            sex: content
                                        }
                                    })
                                }
                            }}/>
                        :
                        <>
                            {
                                props.modeInstance?.status ?
                                <>
                                    <span>{props.userProfiles.sex === 0 ? '女':props.userProfiles.sex === 1 ? '男':'未设置'}</span>
                                    <Icon 
                                        name='Editor'
                                        width='1.2rem'
                                        height='1.2rem'
                                        onClick={e => {
                                            props.setModeInstance({...props.modeInstance, editorIndex: $(e.currentTarget).parent().attr('editorindex')})
                                        }}/>
                                </>
                                :
                                <span>{props.userProfiles.sex === 0 ? '女':props.userProfiles.sex === 1 ? '男':'未设置'}</span>
                            }
                        </>
                    }
                    
                </div>
            </li>
            <li>
                <div className={`${style.info_title} ${Theme.info_title}`}>
                    <Svg
                        name='Location'
                        style={{
                            width: '1.2rem',
                            height: '1.2rem'
                        }} />
                    <span>位置</span>
                </div>
                <div className={`${style.info_content} ${Theme.info_content}`}>
                    <span>{ props.userProfiles.location === null ? '未知归属地':props.userProfiles.location }</span>
                </div>
            </li>
        </ul>
    )
}

const AccountInfoView = (props) => {

    const [requestStatus, setRequestStatus] = useState(false)

    return (
        <ul className={`${style.user_info_view} ${Theme.user_info_view}`}>
            <li>
                <div className={`${style.info_title} ${Theme.info_title}`}>
                    <Svg
                        name='Uid'
                        style={{
                            width: '1.2rem',
                            height: '1.2rem'
                        }} />
                    <span>UID</span>
                </div>
                <div className={`${style.info_content} ${Theme.info_content}`}>
                    <span>{props.userProfiles.uid}</span>
                </div>
            </li>
            <li>
                <div className={`${style.info_title} ${Theme.info_title}`}>
                    <Svg
                        name='Account'
                        style={{
                            width: '1.2rem',
                            height: '1.2rem'
                        }} />
                    <span>用户名</span>
                </div>
                <div className={`${style.info_content} ${Theme.info_content}`} editorindex='8'>
                    {
                        props.modeInstance?.editorIndex === '8' ?
                        <InstantInput
                            width='12rem'
                            mode='input'
                            label='用户名'
                            value={props.userProfiles.email}
                            loadingStatus={requestStatus}
                            handleClose={() => { props.setModeInstance({...props.modeInstance, editorIndex: null}) }}
                            handleSave={content => {
                                if(content === null || content === '') {
                                    toast("填写的信息不能为空")
                                    return
                                }
                                if(!requestStatus) {
                                    setRequestStatus(true)
                                    let data = new FormData()
                                    data.append('email', content)
                                    modifyEmail({ data: data, toast: { isShow: true, loadingMessage: '提交中...' } }).then(resq => {
                                        if(resq.code === 200) {
                                            props.setModeInstance(current => ({
                                                ...current,
                                                loadingStatus: false,
                                                editorIndex: null,
                                                instance: null,
                                                tempAvatar: null
                                            }))
                                        }
                                        setRequestStatus(false)
                                    }).catch(err => {
                                        setRequestStatus(false)
                                    })
                                }
                            }}/>
                        :
                        <>
                            {
                                props.modeInstance?.status ?
                                <>
                                    <span>{props.userProfiles.email}</span>
                                    <Icon
                                        name='Editor'
                                        width='1.2rem'
                                        height='1.2rem'
                                        onClick={e => {
                                            props.setModeInstance({...props.modeInstance, editorIndex: $(e.currentTarget).parent().attr('editorindex')})
                                        }} />
                                    </>
                                :
                                <span>{props.userProfiles.email}</span>
                            }
                        </>
                    }
                    
                </div>
            </li>
            <li>
                <div className={`${style.info_title} ${Theme.info_title}`}>
                    <Svg
                        name='Password'
                        style={{
                            width: '1.2rem',
                            height: '1.2rem'
                        }} />
                    <span>密码</span>
                </div>
                <div className={`${style.info_content} ${Theme.info_content}`} editorindex='9'>
                    {
                        props.modeInstance?.editorIndex === '9'
                        ?
                        <InstantInput
                            width='12rem'
                            mode='input'
                            type='password'
                            label='密码'
                            value=''
                            loadingStatus={props.modeInstance.loadingStatus}
                            handleClose={() => { props.setModeInstance({...props.modeInstance, editorIndex: null}) }}
                            handleSave={content => {
                                if(!props.modeInstance.loadingStatus) {
                                    props.setModeInstance({
                                        ...props.modeInstance, 
                                        loadingStatus: true,
                                        instance: {
                                            password: content
                                        }
                                    })
                                }
                            }}/>
                        :
                        <>
                            {
                                props.modeInstance?.status ?
                                    <>
                                        <span>点击修改</span>
                                        <Icon
                                            name='Editor'
                                            width='1.2rem'
                                            height='1.2rem'
                                            onClick={e => {
                                                props.setModeInstance({...props.modeInstance, editorIndex: $(e.currentTarget).parent().attr('editorindex')})
                                            }} />
                                    </>
                                    :
                                    <span>点击修改</span>
                                }
                        </>
                    }
                </div>
            </li>
        </ul>
    )
}

// const SettingInfoView = (props) => {
//     return (
//         <ul className={style.user_info_view}>
//             <li>
//                 <div className={style.info_title}>
//                     <i className='asukamis background' />
//                     <span>背景图</span>
//                 </div>
//                 <div className={style.info_content}>
//                     <div className={style.background_change}>
//                         <input
//                             type='file'
//                             accept="image/*"
//                             onChange={e => {
//                                 let files = {...e.target.files}
//                                 props.setModeInstance({
//                                     ...props.modeInstance,
//                                     loadingStatus: true,
//                                     instance: {
//                                         ...props.modeInstance.instance,
//                                         background: files[0]
//                                     }
//                                 })
//                                 e.target.value = ''
//                             }}/>
//                         <span className={style.tips_span}>{props.modeInstance.loadingStatus ? '上传中...':'点击修改'}</span>
//                     </div>
//                 </div>
//             </li>
//         </ul>
//     )
// }

const RenderFunctionView = ({ menuIndex, userProfiles, userInfo, viewUid }) => {
    switch(menuIndex) {
        case 0:
            return <UserInfoView userProfiles={userProfiles} />
        case 1:
            return <Gossip style={{ 'minHeight': 'none' }} userInfo={userInfo} viewUid={viewUid} />
        case 2:
            return <UserLikeView userProfiles={userProfiles} userInfo={userInfo} />
        case 3:
            break
        default:
            break
    }
}

const RenderEditorFunctionView = ({modeInstance ,setModeInstance , userProfiles, userInfo, viewUid }) => {
    switch(modeInstance.menuIndex) {
        case 0:
            return <UserInfoView
                        modeInstance={modeInstance}
                        setModeInstance={setModeInstance}
                        userProfiles={userProfiles} />
        case 1:
            return <AccountInfoView
                        modeInstance={modeInstance}
                        setModeInstance={setModeInstance}
                        userProfiles={userProfiles} />
        // case 2:
        //     return <SettingInfoView
        //                 modeInstance={modeInstance}
        //                 setModeInstance={setModeInstance}
        //                 userProfiles={userProfiles} />
        default:
            break
    }
}

const UserLikeView = (props) => {

    const navigate = useNavigate()

    const [requestInstance, setRequestInstance] = useState({
        pageNum: 1,
        pageSize: 10,
        targetUid: props.userProfiles.uid
    })

    const [dataObject, setDataObject] = useState({
        total: 0,
        pages: 1,
        list: null,
        current: 0
    })

    const dataGet = useCallback((instance) => {
        userlikesListGet({ data: instance, toast: { isShow: false } }).then(resq => {
            if(resq.code === 200) {
                setDataObject(current => ({
                    ...current,
                    total: resq.data.total,
                    pages: resq.data.pages,
                    current: resq.data.current,
                    list: resq.data.list
                }))
            } 
        }).catch(err => { })
    }, [])

    useEffect(() => {
        dataGet(requestInstance)
    }, [requestInstance, dataGet, props.userProfiles.viewerLike])

    return (
        <div className={`${style.user_like_view} ${Theme.user_like_view}`}>
            <CTransitionFade
                keyS={dataObject.list === null}
                left={<UserLikeViewSkeleton />}
                right={
                    <CTransitionFade
                        keyS={dataObject.list?.length === 0}
                        left={<span className={style.info_empty}>TA暂时还没有被点赞哦</span>}
                        right={
                            <>
                                <CTransitionGroup>
                                    {
                                        dataObject.list?.map(item => {
                                            return (
                                                <Collapse key={item.id}>
                                                    <div className={`${style.like_item} ${Theme.like_item}`}>
                                                        <div className={`${style.item_content} ${Theme.item_content}`}>
                                                            <Avatar
                                                                width='3rem'
                                                                height='3rem'
                                                                title={item.nickName}
                                                                alt={item.nickName}
                                                                src={item.avatar}
                                                                onClick={() => {
                                                                    navigate(`/user/${item.uid}`)
                                                                }}/>
                                                            <div className={`${style.info_box} ${Theme.info_box}`}>
                                                                <span>{item.nickName}</span>
                                                                <span>在 {item.createTime} 的时候赞了{props.userProfiles.uid === props.userInfo?.uid ? '你':'TA'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Collapse>
                                            )
                                        })
                                    }
                                </CTransitionGroup>
                            </>
                        } />
                } />
        </div>
    )
} 

const UserSkeleton = () => {
    return (
        <div className={`${style.user_skeleton} ${Theme.user_skeleton}`}>
            <div className={`${style.top_skeleton} ${Theme.top_skeleton}`}>
                <Skeleton variant="circular" width='3.8rem' height='3.8rem' />
                <Skeleton variant="text" style={{ marginTop: '1rem' }} sx={{ fontSize: '1rem' }} width='6rem' height='2rem' />
                <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
            </div>
            <div className={`${style.center_menu} ${Theme.center_menu}`}></div>
            <ul className={`${style.bottom_list} ${Theme.bottom_list}`}>
                <li>
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                </li>
                <li>
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                </li>
                <li>
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                </li>
                <li>
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                </li>
                <li>
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                </li>
                <li>
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2rem' />
                </li>
            </ul>
        </div>
    )
}

const UserLikeViewSkeleton = () => {
    return (
        <ul className={style.user_like_skeleton}>
            <li className={style.skeleton_item}>
                <Skeleton variant="circular" width='3rem' height='3rem' />
                <div className={style.info_item}>
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2.8rem' />
                    <Skeleton variant="text" sx={{ fontSize: '0.6rem' }} width='12rem' height='2rem' />
                </div>
            </li>
            <li className={style.skeleton_item}>
                <Skeleton variant="circular" width='3rem' height='3rem' />
                <div className={style.info_item}>
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2.8rem' />
                    <Skeleton variant="text" sx={{ fontSize: '0.6rem' }} width='12rem' height='2rem' />
                </div>
            </li>
            <li className={style.skeleton_item}>
                <Skeleton variant="circular" width='3rem' height='3rem' />
                <div className={style.info_item}>
                    <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width='6rem' height='2.8rem' />
                    <Skeleton variant="text" sx={{ fontSize: '0.6rem' }} width='12rem' height='2rem' />
                </div>
            </li>
        </ul>
    )
}