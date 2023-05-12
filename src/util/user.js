import request from '../util/axios'

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
export const blogUserLoginOut = () => {
    return request({
        url: '/user/login-out',
        method: 'post',
        data: null
    })
}

export const blogUserProfiles = (params) => {
    return request({
        url: '/user/profiles/view/' + params,
        method: 'get'
    })
}
export const blogUserProfilesModify = (query) => {
    return request({
        url: '/user/profiles/modify',
        method: 'put',
        data: parseFormData(query),
    })
}

export const blogUserProfilesModifyEmail = (query) => {
    return request({
        url: '/user/profiles/modify/email',
        method: 'post',
        data: parseFormData(query),
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