import request from '../util/axios'

export const regiserMail = ({ data, toast }) => {
    return request({
        url: '/mail/register',
        method: 'post',
        data: data,
        toast: toast
    })
}
export const modifyEmail = ({ data, toast }) => {
    return request({
        url: '/mail/modify/email',
        method: 'post',
        data: data,
        toast: toast
    })
}
export const findPassword = ({ data, toast }) => {
    return request({
        url: '/mail/find-password',
        method: 'post',
        data: parseFormData(data),
        toast: toast
    })
}
const parseFormData = (obj) => {
    let data = new FormData()
    Object.keys(obj).map(key => {
        data.append(key, obj[key])
        return null
    })
    return data
}