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