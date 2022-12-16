import request from '../util/axios'

export const blogLoginUser = (query) => {
    return request({
        url: '/user/login',
        method: 'post',
        data: query,
    })
}
export const blogRegisterUser = (query) => {
    return request({
        url: '/user/register',
        method: 'post',
        data: query,
    })
}