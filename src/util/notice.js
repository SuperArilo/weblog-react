import request from '../util/axios'

export const noticeGet = (params) => {
    return request({
        url: '/notice/list',
        method: 'get',
        params: params
    })
}
export const readNotice = (query) => {
    return request({
        url: '/notice/read',
        method: 'post',
        data: query
    })
}