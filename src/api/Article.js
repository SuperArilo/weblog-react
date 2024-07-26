import request from '../util/Request'

//文章管理列表获取
export const articleListGet = ({ data, toast }) => {
    return request({
        url: '/article/list',
        method: 'get',
        params: data,
        toast: toast
    })
}
//文章详情获取
export const articleContentGet = ({ data, toast }) => {
    return request({
        url: '/article/content',
        method: 'get',
        params: data,
        toast: toast
    })
}
//文章喜欢
export const increaseArticleLike = ({ data, toast }) => {
    return request({
        url: '/article/like',
        method: 'put',
        data: data,
        toast: toast
    })
}
//文章评论获取
export const articleCommentGet = ({ data, toast }) => {
    return request({
        url: '/article/comment/list',
        method: 'get',
        params: data,
        toast: toast
    })
}

//评论文章或者回复某个人
export const replyComment = ({ data, toast }) => {
    return request({
        url: '/article/comment/add',
        method: 'post',
        data: data,
        toast: toast
    })
}

//喜欢某条评论
export const likeComment = ({ data, toast }) => {
    return request({
        url: '/article/comment/like',
        method: 'put',
        data: data,
        toast: toast
    })
}

//删除某条评论
export const deleteComment = ({ data, toast }) => {
    return request({
        url: '/article/comment/delete',
        method: 'Delete',
        data: data,
        toast: toast
    })
}