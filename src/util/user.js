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
export const blogUserProfiles = (params) => {
    return request({
        url: '/user/profiles/' + params,
        method: 'get'
    })
}
export const blogUserProfilesModify = (query) => {
    return request({
        url: '/user/profiles/modify',
        method: 'put',
        data: query,
    })
}