import request from '../util/axios'
export const customUploadImage = (query) => {
    return request({
        url: '/upload/image',
        method: 'post',
        data: query,
    })
}