import request from '../util/axios'
//留言列表获取
export const guestbookList = (params) => {
    return request({
        url: '/guestbook/list',
        method: 'get',
        params: params
    })
}
export const addGuestbook = (query) => {
    return request({
        url: '/guestbook/add',
        method: 'post',
        data: query
    })
}
export const deleteGuestbook = (query) => {
    return request({
        url: '/guestbook/delete',
        method: 'delete',
        data: query
    })
}