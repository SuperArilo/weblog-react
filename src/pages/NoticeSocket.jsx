import { useCallback, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { useDispatch } from 'react-redux'

const NoticeSocket = ({ token = null }) => {

    const { lastMessage } = useWebSocket(`${process.env.NODE_ENV === "development" ? 'ws':'wss'}://${window.location.hostname}/ws/notice`, { protocols: [token] })

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