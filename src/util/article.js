import request from '../util/axios'
import Qs from "query-string"

//文章管理列表获取
export const articleListGet = (params) => {
    return request({
        url: '/article/list',
        method: 'get',
        params: params
    })
}
//文章详情获取
export const articleContentGet = (params) => {
    return request({
        url: '/article/content',
        method: 'get',
        params: params
    })
}
//文章喜欢
export const increaseArticleLike = (query) => {
    return request({
        url: '/article/like',
        method: 'put',
        data: query,
    })
}
//文章评论获取
export const articleCommentGet = (params) => {
    return request({
        url: '/article/comment/list',
        method: 'get',
        params: params
    })
}

//评论文章或者回复某个人
export const replyComment = (query) => {
    return request({
        url: '/article/comment/add',
        method: 'post',
        data: query,
    })
}

//喜欢某条评论
export const likeComment = (query) => {
    return request({
        url: '/article/comment/like',
        method: 'put',
        data: query,
    })
}

//删除某条评论
export const deleteComment = (query) => {
    return request({
        url: '/article/comment/delete',
        method: 'Delete',
        data: query,
    })
}