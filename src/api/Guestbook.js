import request from '../util/axios'
//留言列表获取
export const guestbookList = ({ data, toast }) => {
    return request({
        url: '/guestbook/list',
        method: 'get',
        params: data,
        toast: toast
    })
}
export const addGuestbook = ({ data, toast }) => {
    return request({
        url: '/guestbook/add',
        method: 'post',
        data: data,
        toast: toast
    })
}
export const deleteGuestbook = ({ data, toast }) => {
    return request({
        url: '/guestbook/delete',
        method: 'delete',
        data: data,
        toast: toast
    })
}