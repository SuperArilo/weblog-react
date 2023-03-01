import request from '../util/axios'
import Qs from 'query-string'

//友邻列表获取
export const linksList = (params) => {
    return request({
        url: '/links/list',
        method: 'get',
        params: params
    })
}
//友邻申请
export const linksApply = (query) => {
    return request({
        url: '/links/apply',
        method: 'post',
        data: Qs.stringify(query)
    })
}