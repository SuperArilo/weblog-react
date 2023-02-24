import request from '../axios'

export const regiserMail = (query) => {
    return request({
        url: '/mail/register',
        method: 'post',
        data: query,
    })
}