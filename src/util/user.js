import request from '../util/axios'

export const blogLoginUser = ({ data, toast }) => {
    return request({
        url: '/user/login',
        method: 'post',
        data: parseFormData(data),
        toast: toast
    })
}
export const blogRegisterUser = ({ data, toast }) => {
    return request({
        url: '/user/register',
        method: 'post',
        data: data,
        toast: toast
    })
}
export const blogUserLoginOut = ({ data, toast }) => {
    return request({
        url: '/user/login-out',
        method: 'post',
        data: data,
        toast: toast
    })
}

export const blogUserProfiles = ({ data, toast }) => {
    return request({
        url: '/user/profiles/view/' + data,
        method: 'get',
        toast: toast
    })
}
export const blogUserProfilesModify = ({ data, toast }) => {
    return request({
        url: '/user/profiles/modify',
        method: 'put',
        data: parseFormData(data),
        toast: toast
    })
}

export const blogUserProfilesModifyEmail = ({ data, toast }) => {
    return request({
        url: '/user/profiles/modify/email',
        method: 'post',
        data: parseFormData(data),
        toast: toast
    })
}
export const findPasswordVerify = ({ data, toast }) => {
    return request({
        url: '/user/profiles/find-password/verify',
        method: 'post',
        data: parseFormData(data),
        toast: toast
    })
}
export const passwordModify = ({ data, toast }) => {
    return request({
        url: '/user/profiles/modify/password',
        method: 'put',
        data: parseFormData(data),
        toast: toast
    })
}
const parseFormData = (obj) => {
    let data = new FormData()
    if (obj == null) return
    Object.keys(obj).map(key => {
        data.append(key, obj[key])
        return null
    })
    return data
}