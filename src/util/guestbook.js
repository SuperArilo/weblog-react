import request from '../util/axios'
//留言列表获取
export const guestbookList = (params) => {
    return request({
        url: '/guestbook/list',
        method: 'get',
        params: params
    })
}