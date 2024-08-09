import request from '../util/Request'

export const cialloListGet = ({ data, toast = null }) => {
    return request({
        url: '/ciallo/list',
        method: 'get',
        params: data,
        toast: toast
    })
}