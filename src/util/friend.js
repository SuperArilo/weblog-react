import request from '../util/axios'

export const friendGet = (params) => {
    return request({
        url: '/visitor/list',
        method: 'get',
        params: params
    })
}