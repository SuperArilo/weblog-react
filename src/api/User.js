import request from '../util/axios'
import { parseFormData } from '../util/PublicFunction'

export const blogLoginUser = ({ data, toast }, customHeader) => {
    return request({
        url: '/user/login',
        method: 'post',
        headers: customHeader,
        data: parseFormData(data),
        toast: toast
    })
}
export const blogLoginUserToken = ({ }, customHeader) => {
    return request({
        url: '/user/token',
        method: 'post',
        headers: customHeader
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