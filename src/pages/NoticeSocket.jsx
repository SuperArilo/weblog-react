import { useCallback, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { useDispatch } from 'react-redux'
import { API_VERSION } from '../util/Request'

const NoticeSocket = ({ token = null }) => {

    const { lastMessage } = useWebSocket(`${import.meta.env.MODE === "development"  ? 'ws':'wss'}://${import.meta.env.MODE === "development" ? 'localhost:8080':window.location.hostname}${API_VERSION}/ws/notice`, { protocols: [token] })

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