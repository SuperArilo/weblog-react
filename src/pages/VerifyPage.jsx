import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import style from '../assets/scss/verifyPage.module.scss'
import { useParams, useNavigate, useLocation  } from "react-router-dom"
import customTips from '../util/notostack/customTips'
export default function VerifyPage(props) {

    //hook
    const { search } = useLocation()
    const [requestInstance, setRequestInstance] = useState({
        token: null,
        verifyCode: null
    })
    
    useEffect(() => {
        let searchParams = new URLSearchParams(search)
        let token = searchParams.get('token')
        let verifyCode = searchParams.get('verifyCode')
        if(token !== null && verifyCode !== null) {
            setRequestInstance(target => {
                return {
                    ...target,
                    token: token,
                    verifyCode: verifyCode
                }
            })
        } else {
            customTips.error('获取到的实例参数为空')
        }
    }, [search])

    return (
        <div className={style.verify_page}>
            <div className={style.verify_content}>
                <p>邮箱验证成功！</p>
                <p>正在跳转页面...</p>
            </div>
        </div>
    )
}