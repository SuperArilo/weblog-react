import request from '../util/axios'

//查看点赞列表
export const userlikesListGet = ({ data, toast }) => {
    return request({
        url: '/user/like/list',
        method: 'get',
        params: data,
        toast: toast
    })
}
export const targetLikeUser = ({ data, toast }) => {
    return request({
        url: '/user/like/apply',
        method: 'post',
        data: data,
        toast: toast
    })
}