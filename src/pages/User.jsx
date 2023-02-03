import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
//样式
import style from '../assets/scss/user.module.scss'
//方法
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from "react-router-dom"
import $ from 'jquery'
import { blogUserProfiles, blogUserProfilesModify } from '../util/user'
import customTips from '../util/notostack/customTips'
//组件
import Gossip from './gossip'
import Avatar from '../components/Avatar'
import WaterWave from 'water-wave'
import AsukaButton from '../components/asukaButton'
import Icon from '../components/Icon'
import InstantInput from '../components/InstantInput'

export default function User(props) {
    //hook
    const navigate = useNavigate()
    //params
    const userInfo = useSelector((state) => state.userInfo.info)
    const [userProfiles, setUserProfiles] = useState(null)
    const { viewUid } = useParams()
    const [modeInstance, setModeInstance] = useState({
        menuIndex: 0,
        status: false,
        editorIndex: null,
        loadingStatus: false,
        instance: null
    })

    //info
    const [infoMenuList, setInfoMenuList] = useState([
        {
            id: 0,
            title: '资料',
            icon: 'info'
        },
        {
            id: 1,
            title: '碎语',
            icon: 'gossip'
        },
        {
            id: 2,
            title: '点赞',
            icon: 'ulike'
        }
    ])
    //editor
    const [editorMenuList, setEditorMenuList] = useState([
        {
            id: 0,
            title: '资料',
            icon: 'info'
        },
        {
            id: 1,
            title: '账号',
            icon: 'avatar'
        },
        {
            id: 2,
            title: '设置',
            icon: 'setting'
        }
    ])

    //ref
    const menuLineRef = useRef(null)

    const queryProfiles = useCallback(params => {
        blogUserProfiles(params).then(resq => {
            if(resq.code === 200) {
                setUserProfiles(resq.data)
            } else {
                customTips.error(resq.message)
            }
        }).catch(err => {
            customTips.error(err.message)
        })
    }, [])

    useEffect(() => {
        queryProfiles(viewUid)
    }, [viewUid, queryProfiles])

    useEffect(() => {
        if(modeInstance.instance === null) return
        blogUserProfilesModify(modeInstance.instance).then(resq => {
            if(resq.code === 200) {
                customTips.success(resq.message)
                queryProfiles(viewUid)
            } else {
                customTips.error(resq.message)
            }
            setModeInstance(current => ({
                ...current,
                loadingStatus: false,
                editorIndex: null,
                instance: null
            }))
        }).catch(err => {
            customTips.error(err.message)
            setModeInstance(current => ({
                ...current,
                loadingStatus: false
            }))
        })
    }, [modeInstance.instance, queryProfiles, viewUid])

    return (
        <div className={style.user_info}>
            {
                userProfiles === null ? <UserSkeleton />:
                <div className={style.info_box}>
                    <div className={style.user_head_box}>
                        <Avatar width='3.8rem' height='3.8rem' src={userProfiles.avatar} />
                        <div className={style.public_info_item} eidtorindex='0'>
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
                                    <p className={style.nick_name}>{userProfiles.nickName}</p>
                                    {
                                        modeInstance.status && <Icon 
                                                                    iconClass='editor'
                                                                    fontSize='1.2rem'
                                                                    onClick={e => {
                                                                        setModeInstance({...modeInstance, editorIndex: $(e.currentTarget).parent().attr('eidtorindex')})
                                                                    }}/>
                                    }
                                </>
                            }
                            
                        </div>
                        <div className={style.public_info_item} eidtorindex='1'>
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
                                    <span className={style.autograph}>{userProfiles.autograph}</span>
                                    {
                                        modeInstance?.status && <Icon 
                                                                    iconClass='editor'
                                                                    fontSize='1.2rem'
                                                                    onClick={e => {
                                                                        setModeInstance({...modeInstance, editorIndex: $(e.currentTarget).parent().attr('eidtorindex')})
                                                                    }}/>
                                    }
                                </>
                            }
                        </div>
                        {
                            userInfo?.uid !== parseInt(viewUid) ? null:<AsukaButton 
                                                                            text={modeInstance.status ? '退出编辑模式':'编辑个人资料'}
                                                                            class={modeInstance.status ? 'danger':'normal'}
                                                                            onClick={() => {
                                                                                setModeInstance({...modeInstance, status: !modeInstance.status, editorIndex: null})
                                                                            }}/>
                        }
                        
                    </div>
                    <div className={style.function_box}>
                        <header className={style.select_title}>
                            <div ref={menuLineRef} className={style.select_line} type='line' />
                            {
                                modeInstance.status ?
                                editorMenuList.map(item => {
                                    return (
                                        <div
                                            className={`${style.select_title_item} ${modeInstance.menuIndex === item.id ? style.select_title_item_active:''}`}
                                            index={item.id}
                                            key={item.id}
                                            onClick={() => {
                                                setModeInstance({...modeInstance, menuIndex: item.id})
                                                $(menuLineRef.current).css({ left: $($('div[index]')[item.id]).width() * item.id })
                                            }}>
                                            <i className={`${'asukamis'} ${item.icon}`} />
                                            <span>{item.title}</span>
                                            <WaterWave color="rgb(155, 195, 219)" duration={ 500 } />
                                        </div>
                                    )
                                })
                                :
                                infoMenuList.map(item => {
                                    return (
                                        <div
                                            className={`${style.select_title_item} ${modeInstance.menuIndex === item.id ? style.select_title_item_active:''}`}
                                            index={item.id}
                                            key={item.id}
                                            onClick={() => {
                                                setModeInstance({...modeInstance, menuIndex: item.id})
                                                $(menuLineRef.current).css({ left: $($('div[index]')[item.id]).width() * item.id })
                                            }}>
                                            <i className={`${'asukamis'} ${item.icon}`} />
                                            <span>{item.title}</span>
                                            <WaterWave color="rgb(155, 195, 219)" duration={ 500 } />
                                        </div>
                                    )
                                })
                            }
                        </header>
                        <div className={style.sleect_function_box}>
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
            }
        </div>
    )
}
const UserInfoView = (props) => {
    
    return (
        <ul className={style.user_info_view}>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis ucontact' />
                    <span>联系方式</span>
                </div>
                <div className={style.info_content}>
                    {
                        props.modeInstance?.status ?
                        <>
                            <span>{props.userProfiles.email}</span>
                            <Icon 
                                iconClass='editor'
                                fontSize='1.2rem'
                                onClick={e => {

                                }}/>
                            </>
                        :
                        <span>{props.userProfiles.email}</span>
                    }
                </div>
            </li>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis calendar' />
                    <span>注册时间</span>
                </div>
                <div className={style.info_content}>
                    <span>{props.userProfiles.registerTime}</span>
                </div>
            </li>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis identity' />
                    <span>身份标签</span>
                </div>
                <div className={style.info_content}>
                    <span>{props.userProfiles.category}</span>
                </div>
            </li>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis calendar' />
                    <span>年龄</span>
                </div>
                <div className={style.info_content} editorindex='4'>
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
                                // if(!modeInstance.loadingStatus) {
                                //     setModeInstance({...modeInstance, loadingStatus: true})
                                //     let data = new FormData()
                                //     data.append('autograph', content)
                                //     blogUserProfilesModify(data).then(resq => {
                                //         if(resq.code === 200) {
                                //             customTips.success(resq.message)
                                //             queryProfiles(viewUid)
                                //         } else {
                                //             customTips.error(resq.message)
                                //         }
                                //         setModeInstance({...modeInstance, loadingStatus: false, editorIndex: null})
                                //     }).catch(err => {
                                //         customTips.error(err.message)
                                //         setModeInstance({...modeInstance, loadingStatus: false})
                                //     })
                                // }
                            }}/>
                        :
                        <>
                            {
                                props.modeInstance?.status ?
                                <>
                                    <span>{props.userProfiles.age}</span>
                                    <Icon 
                                            iconClass='editor'
                                            fontSize='1.2rem'
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
                <div className={style.info_title}>
                    <i className='asukamis sex' />
                    <span>性别</span>
                </div>
                <div className={style.info_content} editorindex='5'>
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
                            }}/>
                        :
                        <>
                            {
                                props.modeInstance?.status ?
                                <>
                                    <span>{props.userProfiles.sex === 0 ? '女':'男'}</span>
                                    <Icon 
                                            iconClass='editor'
                                            fontSize='1.2rem'
                                            onClick={e => {
                                                props.setModeInstance({...props.modeInstance, editorIndex: $(e.currentTarget).parent().attr('editorindex')})
                                            }}/>
                                </>
                                :
                                <span>{props.userProfiles.sex === 0 ? '女':'男'}</span>
                            }
                        </>
                    }
                    
                </div>
            </li>
            <li>
                <div className={style.info_title}>
                    <i className='asukamis location' />
                    <span>位置</span>
                </div>
                <div className={style.info_content}>
                    {
                        props.modeInstance?.status ?
                        <>
                            <span>{props.userProfiles.location === null ? '未设置':props.userProfiles.location}</span>
                            <Icon 
                                iconClass='editor'
                                fontSize='1.2rem'
                                onClick={e => {}}/>
                        </>
                        :
                        <span>{props.userProfiles.location === null ? '未设置':props.userProfiles.location}</span>
                    }
                </div>
            </li>
        </ul>
    )
}
const RenderFunctionView = ({ menuIndex, userProfiles, userInfo, viewUid }) => {
    switch(menuIndex) {
        case 0:
            return <UserInfoView userProfiles={userProfiles} />
        case 1:
            return <Gossip userInfo={userInfo} viewUid={viewUid} />
        case 2:
            return <span>开发中</span>
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
                        userProfiles={userProfiles}
                        />
        case 1:
            return <span>开发中</span>
        case 2:
            return <span>开发中</span>
        default:
            break
    }
}
const UserSkeleton = () => {
    return (
        <div className={style.user_skeleton}></div>
    )
}