import request from '../util/Request'
import { parseFormData } from '../util/PublicFunction'
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