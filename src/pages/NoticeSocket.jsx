import { useCallback, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { useDispatch } from 'react-redux'

const NoticeSocket = ({ token = null }) => {

    const { lastMessage } = useWebSocket(`${import.meta.env.MODE === "development"  ? 'ws':'wss'}://${import.meta.env.MODE === "development" ? 'localhost:8080':window.location.hostname}/api/v1/ws/notice`, { protocols: [token] })

    const dispatch = useDispatch()
    const setInstance = useCallback(value => {
        dispatch({ type: 'pushNotice/setPushNotice', payload: value })
    }, [dispatch])
    useEffect(() => {
        if(lastMessage !== null) {
            setInstance(JSON.parse(lastMessage.data))
        }
    }, [lastMessage, setInstance])

    return null
}
export default NoticeSocket