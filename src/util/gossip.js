import request from '../util/axios'

//碎语列表获取
export const gossipListRequest = (params) => {
    return request({
        url: '/gossip/list',
        method: 'get',
        params: params
    })
}
//用户发表碎语
export const userCreateGossip = (query) => {
    return request({
        url: '/gossip/add',
        method: 'post',
        data: query,
    })
}
//删除某条碎语
export const deleteGossip = (query) => {
    return request({
        url: '/gossip/delete',
        method: 'Delete',
        data: query,
    })
}
//喜欢某条碎语
export const likeGossip = (query) => {
    return request({
        url: '/gossip/like',
        method: 'put',
        data: query,
    })
}
//碎语评论列表获取
export const gossipCommentList = (params) => {
    return request({
        url: '/gossip/comment/list',
        method: 'get',
        params: params
    })
}
//碎语评论新增或者回复某人
export const replyGossipComment = (query) => {
    return request({
        url: '/gossip/comment/add',
        method: 'post',
        data: query
    })
}
//喜欢某条评论
export const likeGossipComment = (query) => {
    return request({
        url: '/gossip/comment/like',
        method: 'put',
        data: query,
    })
}
//删除某条评论
export const deleteGossipComment = (query) => {
    return request({
        url: '/gossip/comment/delete',
        method: 'Delete',
        data: query,
    })
}