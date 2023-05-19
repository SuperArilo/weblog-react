import request from '../axios'

export const regiserMail = (query) => {
    return request({
        url: '/mail/register',
        method: 'post',
        data: query,
    })
}
export const modifyEmail = (query) => {
    return request({
        url: '/mail/modify/email',
        method: 'post',
        data: query
    })
}
export const findPassword = query => {
    return request({
        url: '/mail/find-password',
        method: 'post',
        data: parseFormData(query)
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