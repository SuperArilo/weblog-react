import style from './MinecraftMap.module.scss'
import theme from './MinecraftMap.Theme.module.scss'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import { Slide } from '@mui/material'
import { BASE_URL } from '../util/Request'
import { API_VERSION } from '../util/Request'
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import useWebSocket from 'react-use-websocket'
import toast from 'react-hot-toast'
import { formatDateTime } from '../util/PublicFunction'
export default function MinecraftMap() {

    const isDark = useSelector(state => state.theme.isDark)

    const userInfo = useSelector((state) => state.userInfo.info)
    const chatDom = useRef(null)
    const onlineTalk = useRef(null)
    const [isUserScroll, setIsUserScroll] = useState(false)
    const [isBottom, setIsBottom] = useState(true)

    const [talkBoxStatus, setTalkBoxStatus] = useState(false)
    const [messageHistory, setMessageHistory] = useState([])

    const [inputMessage, setInputMessage] = useState('')

    const scrollToBottom = () => {
        setTimeout(() => {
            if(chatDom.current == null || isUserScroll) return
            if(isBottom) {
                chatDom.current.scrollTo({ top: chatDom.current.scrollHeight, behavior: 'smooth' })
            }
        }, 200)
    }

    const sendToMessage = () => {
        if(inputMessage == null || inputMessage == '') {
            toast('发送的内容不能为空哦')
            return
        }
        setInputMessage("")
        setMessageHistory(current => current.concat({ name: userInfo.nickName, type: "WEB", message: inputMessage, time: formatDateTime(new Date()) }))
        scrollToBottom()
        onlineTalk.current._sendMessage(inputMessage)
    }

    useEffect(() => {
        if(userInfo !== null) return
        setTalkBoxStatus(false)
    }, [userInfo])

    return (
        <div className={`${style['map_page']} ${isDark ? theme.dark_map_page:theme.light_map_page}`}>
            <div className={style['map_title_function']}>
                <span className={style['map_title']}>凡尔赛小镇服务器</span>
                <Button
                    size='small'
                    text='在线聊天'
                    onClick={() => {
                        if(userInfo == null) {
                            toast('需要登录才能接入聊天哦！')
                            return
                        }
                        setTalkBoxStatus(prev => !prev)
                        setMessageHistory([])
                    }} />
            </div>
            <div className={`${style['map_content']} ${theme['map_content']}`}>
                <Slide direction="right" in={talkBoxStatus} mountOnEnter unmountOnExit>
                    <div className={`${style['online_talk_box']} ${theme['online_talk_box']}`}>
                        <div className={`${style['instance_box']} ${theme['instance_box']}`}>
                            <ul
                                className={`${style['history_list']} ${theme['history_list']}`}
                                ref={chatDom}
                                onScroll={() => {
                                    if(chatDom.current.scrollHeight > chatDom.current.clientHeight) {
                                        setIsBottom(chatDom.current.scrollHeight > chatDom.current.clientHeight && chatDom.current.scrollTop + chatDom.current.clientHeight + 60 >= chatDom.current.scrollHeight)
                                    } else {
                                        setIsBottom(true)
                                    }
                                }}
                                onWheel={(e) => {
                                    if (e.deltaY !== 0) {
                                        setIsUserScroll(e.deltaY < 0 || !(e.deltaY > 0 && isBottom))
                                    }
                                }}>
                                {
                                    messageHistory.map((item, index) => {
                                        return (
                                            <li key={index} className={style[`type_${item.type}`]}>
                                                <Avatar
                                                    radius={false}
                                                    src={item.type == 'WEB' ? userInfo?.avatar:item.type == 'WEB_OTHER' ? `${BASE_URL}${API_VERSION}/user/avatar/${item.uid}`:`${BASE_URL}${API_VERSION}/maps/${item.worldName}/assets/playerheads/${item.uuid}.png`} />
                                                <div className={`${style['user_content']} ${theme['user_content']}`}>
                                                    <div className={style['user_info']}>
                                                        <span className={style['user_name']}>{item.name}</span>
                                                        {
                                                            item.type !== 'WEB'
                                                            &&
                                                            <span className={style['come_from']}>{`(来自${item.type == 'MINECRAFT' ? '游戏':item.type === 'WEB_OTHER' ? 'web':null})`}</span>
                                                        }
                                                        
                                                    </div>
                                                    <span className={`${style['time']} ${theme['time']}`}>{item.time}</span>
                                                    <div className={`${style['talk_content']} ${theme['talk_content']}`}>
                                                        {item.message}
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <div className={`${style['input_content']} ${theme['input_content']}`}>
                                <textarea
                                    value={inputMessage}
                                    name="online_talk"
                                    onChange={e => setInputMessage(e.target.value)}
                                    onKeyDown={event => {
                                        if(event.key === 'Enter' && !event.shiftKey) {
                                            event.preventDefault()
                                            sendToMessage()
                                        }
                                    }} />
                                <div className={style['button_function']}>
                                    <Button text='发送' size='small' onClick={() => sendToMessage()} />
                                </div>
                            </div>
                        </div>
                    </div>
				</Slide>
                <iframe src={`${BASE_URL}/map.html`} />
            </div>
            {
                (localStorage.getItem('token') && talkBoxStatus) && 
                <OnlineTalk
                    ref={onlineTalk}
                    _handleMessage={message => {
                        if(message instanceof Array) {
                            setMessageHistory(message)
                            scrollToBottom()
                            return
                        }
                        scrollToBottom()
                        setMessageHistory(current => current.concat(message))
                    }} /> 
            }
            
        </div>
    )
}
const OnlineTalk = forwardRef(({ _handleMessage }, ref) => {

    const { lastMessage, sendMessage, readyState, getWebSocket }  = useWebSocket(`${import.meta.env.MODE === "development"  ? 'ws':'wss'}://${import.meta.env.MODE === "development" ? 'localhost:8080':window.location.hostname}${API_VERSION}/ws/minecraft/online?token=${localStorage.getItem('token')}`,{ shouldReconnect: () => true })
    
    const _sendMessage = (message) => sendMessage(JSON.stringify({ type: "WEB", message: message }))
    
    useImperativeHandle(ref, () => ({
        _sendMessage
    }))

    useEffect(() => {
        if(lastMessage == null) return
        _handleMessage(JSON.parse(lastMessage.data))
    }, [lastMessage])

    useEffect(() => {
        if(readyState == 3) {
            toast.error('和服务器的断开连接，请尝试关闭重新发起连接')
        }
    }, [readyState])
})