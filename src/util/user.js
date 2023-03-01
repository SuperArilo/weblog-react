import request from '../util/axios'
import Qs from 'query-string'

export const blogLoginUser = (query) => {
    return request({
        url: '/user/login',
        method: 'post',
        data: query,
    })
}
export const blogRegisterUser = (query) => {
    return request({
        url: '/user/register',
        method: 'post',
        data: query,
    })
}
export const blogUserProfiles = (params) => {
    return request({
        url: '/user/profiles/' + params,
        method: 'get'
    })
}
export const blogUserProfilesModify = (query) => {
    return request({
        url: '/user/profiles/modify',
        method: 'put',
        data: Qs.stringify(query),
    })
}
// const parseFormData = (obj) => {
//     let data = new FormData()
//     Object.keys(obj).map(key => {
//         data.append(key, obj[key])
//         return null
//     })
//     return data
// }