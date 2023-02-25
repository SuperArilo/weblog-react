import request from '../util/axios'

export const noticeGet = (params) => {
    return request({
        url: '/notice/list',
        method: 'get',
        params: params
    })
}