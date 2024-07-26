import request from '../util/Request'
export const customUploadImage = ({ data, toast }) => {
    return request({
        url: '/upload/image',
        method: 'post',
        data: data,
        toast: toast
    })
}