import request from '../util/axios'

//碎语列表获取
export const gossipList = (params) => {
    return request({
        url: '/gossip/list',
        method: 'get',
        params: params
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