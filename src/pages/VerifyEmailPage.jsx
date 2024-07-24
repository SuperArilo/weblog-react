import React, { useState, useEffect, useCallback } from 'react'
import style from './VerifyPage.module.scss'
import { useNavigate, useLocation  } from "react-router-dom"
import { blogUserProfilesModifyEmail } from '../util/user'
import toast from 'react-hot-toast'
import Icon from '../components/Icon'
export default function VerifyPage(props) {

    //hook
    const { search } = useLocation()
    const navigate = useNavigate()
    const [requestInstance, setRequestInstance] = useState({
        previousToken: null,
        verifyCode: null
    })

    const [finalState, setFinalState] = useState(null)
    
    useEffect(() => {
        let searchParams = new URLSearchParams(search)
        let previousToken = searchParams.get('previousToken')
        let verifyCode = searchParams.get('verifyCode')
        if(previousToken !== null && verifyCode !== null) {
            setRequestInstance(target => {
                return {
                    ...target,
                    previousToken: previousToken,
                    verifyCode: verifyCode
                }
            })
        } else {
            toast.error('获取到的实例参数为空')
        }
    }, [search])

    const redirect = useCallback(() => {
        setTimeout(() => {
            navigate('/')
        }, 3000)
    }, [navigate])

    const sendVerify = useCallback(instance => {
        blogUserProfilesModifyEmail(instance).then(resq => {
            if(resq.code === 200) {
                setFinalState(true)
                localStorage.setItem('token', resq.data)
            } else {
                setFinalState(false)
            }
            redirect()
        }).catch(err => {
            setFinalState(false)
            redirect()
        })
    }, [redirect])

    

    useEffect(() => {
        if(requestInstance.previousToken === null || requestInstance.previousToken === '' || requestInstance.verifyCode === null || requestInstance.verifyCode === '') return
        sendVerify(requestInstance)
    }, [requestInstance, sendVerify])

    return (
        <div className={style.verify_page}>
            <div className={style.verify_content}>
                {
                    finalState === null &&
                    <div className={style.verifying}>
                        <Icon
                            iconClass='loading rotate'
                            status={true}
                            fontSize='1.5rem'
                            />
                        <p>邮箱验证中...</p>
                    </div>
                }
                {
                    finalState &&
                    <div className={style.verify_success}>
                        <Icon
                            iconClass='success'
                            fontSize='1.3rem'
                            />
                        <p>邮箱验证成功，正在跳转...</p>
                    </div>
                }
                {
                    finalState === false &&
                    <div className={style.verify_error}>
                        <Icon
                            iconClass='close'
                            fontSize='1rem'
                            />
                        <p>邮箱验证失败</p>
                    </div>
                }
                
            </div>
        </div>
    )
}