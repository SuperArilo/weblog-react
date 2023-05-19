import React, { useState, useEffect, useCallback } from 'react'
import style from '../assets/scss/findPassword.module.scss'
import TextField from '@mui/material/TextField'
import AsukaButtom from '../components/asukaButton'
import toast from 'react-hot-toast'
import { findPasswordVerify, passwordModify } from '../util/user'
import { useParams, useNavigate, useLocation  } from "react-router-dom"
import Icon from '../components/Icon'
export default function FindPassword(props) {

    //hook
    const { search } = useLocation()
    const navigate = useNavigate()

    const [status, setStatus] = useState(false)
    const [requstInstance, setRequestInstance] = useState({
        verifyUUID: '',
        email: '',
        password: '',
        passwordAgain: ''
    })

    useEffect(() => {
        let searchParams = new URLSearchParams(search)
        let email = searchParams.get('email')
        let verifyCode = searchParams.get('verifyCode')
        if(email !== null && verifyCode !== null) {
            if (requstInstance.verifyUUID === '') {
                const id = toast.loading('验证中...')
                findPasswordVerify({ email: email, verifyCode: verifyCode }).then(resq => {
                    if(resq.code === 200) {
                        toast.success('授权码验证成功', { id: id })
                        setRequestInstance(target => {
                            return {
                                ...target,
                                verifyUUID: resq.data,
                                email: email
                            }
                        })
                    } else {
                        toast.error(resq.message, { id: id })
                    }
                }).catch(err => {
                    toast.error(err.message, { id: id })
                })
            }
        } else {
            toast.error('获取到的实例参数为空')
        }
    }, [search, requstInstance.verifyUUID])

    const redirect = useCallback(() => {
        setTimeout(() => {
            navigate('/')
        }, 3000)
    }, [navigate])

    return (
        <div className={style.find_password_page}>
            {
                requstInstance.verifyUUID === '' ?
                <div className={style.loading_content}>
                    <Icon
                        iconClass='loading rotate'
                        fontSize='1.5rem'/>
                </div>
                :
                <div className={style.input_content}>
                    <span className={style.input_tips}>请在下面输入您的新密码✔</span>
                    <TextField
                        label="新密码"
                        type='password'
                        style={{ fontSize: '0.8rem' }}
                        variant="standard"
                        size="small"
                        onChange={e => { setRequestInstance({ ...requstInstance, password: e.target.value }) }}
                        />
                    <TextField
                        label="确认密码"
                        type='password'
                        style={{ fontSize: '0.8rem' }}
                        variant="standard"
                        size="small"
                        onChange={e => { setRequestInstance({ ...requstInstance, passwordAgain: e.target.value }) }}
                        />
                    <AsukaButtom
                        text='提交'
                        onClick={() => {
                            if(requstInstance.password === null || requstInstance.password === '' || requstInstance.passwordAgain === null || requstInstance.passwordAgain === '') {
                                toast("填写的内容不能为空哦")
                                return
                            }
                            if(!status) {
                                const id = toast.loading('提交中...')
                                setStatus(true)
                                passwordModify(requstInstance).then(resq => {
                                    if(resq.code === 200) {
                                        toast.success(resq.message, { id: id })
                                        redirect()
                                    } else {
                                        toast.error(resq.message, { id: id })
                                    }
                                    setStatus(false)
                                }).catch(err => {
                                    toast.error(err.message, { id: id })
                                    setStatus(false)
                                })
                            }
                        }}/>
                </div>
            }
            
        </div>
    )
}