import request from '../util/axios'
export const customUploadImage = ({ data, toast }) => {
    return request({
        url: '/upload/image',
        method: 'post',
        data: data,
        toast: toast
    })
}