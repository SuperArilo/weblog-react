import request from '../util/Request'

export const noticeGet = ({ data, toast }) => {
    return request({
        url: '/notice/list',
        method: 'get',
        params: data,
        toast: toast
    })
}
export const readNotice = ({ data, toast }) => {
    return request({
        url: '/notice/read',
        method: 'post',
        data: data,
        toast: toast
    })
}