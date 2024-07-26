import request from '../util/Request'

export const friendGet = ({ data, toast }) => {
    return request({
        url: '/visitor/list',
        method: 'get',
        params: data,
        toast: toast
    })
}