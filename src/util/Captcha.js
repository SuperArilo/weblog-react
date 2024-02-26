import request from '../util/axios'
import { parseFormData } from './PublicFunction'
export const verifyEmail = ({ data, toast }) => {
    return request({
        url: '/captcha/verify',
        method: 'post',
        data: parseFormData(data),
        toast: toast
    })
}