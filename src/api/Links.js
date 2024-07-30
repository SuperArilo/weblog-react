import request from '../util/Request'

//友邻列表获取
export const friendList = ({ data, toast }) => {
    return request({
        url: '/friend/list',
        method: 'get',
        params: data,
        toast: toast
    })
}
//友邻申请
export const linksApply = ({ data, toast }) => {
    return request({
        url: '/friend/apply',
        method: 'post',
        data: data,
        toast: toast
    })
}