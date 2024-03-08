import React, { useState, useCallback, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

const NoticeSocket = props => {

    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost/ws/notice', { protocols: [props.token] })
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState]

    useEffect(() => {
        if(readyState === ReadyState.OPEN) {
            sendMessage('hello')
        } else {
            console.log(readyState)
        }
    }, [readyState, sendMessage])

    return null
}
NoticeSocket.defaultProps = {
    token: null
}
export default NoticeSocket