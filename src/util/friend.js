import request from '../util/axios'

export const friendGet = ({ data, toast }) => {
    return request({
        url: '/visitor/list',
        method: 'get',
        params: data,
        toast: toast
    })
}