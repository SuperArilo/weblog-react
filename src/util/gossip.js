import request from '../util/axios'

//碎语列表获取
export const gossipListRequest = ({ data, toast }) => {
    return request({
        url: '/gossip/list',
        method: 'get',
        params: data,
        toast: toast
    })
}
//用户发表碎语
export const userCreateGossip = ({ data, toast }) => {
    return request({
        url: '/gossip/add',
        method: 'post',
        data: data,
        toast: toast
    })
}
//删除某条碎语
export const deleteGossip = ({ data, toast }) => {
    return request({
        url: '/gossip/delete',
        method: 'Delete',
        data: data,
        toast: toast
    })
}
//喜欢某条碎语
export const likeGossip = ({ data, toast }) => {
    console.log(data)
    console.log(toast)
    return request({
        url: '/gossip/like',
        method: 'put',
        data: data,
        toast: toast
    })
}
//碎语评论列表获取
export const gossipCommentList = ({ data, toast }) => {
    return request({
        url: '/gossip/comment/list',
        method: 'get',
        params: data,
        toast: toast
    })
}
//碎语评论新增或者回复某人
export const replyGossipComment = ({ data, toast }) => {
    return request({
        url: '/gossip/comment/add',
        method: 'post',
        data: data,
        toast: toast
    })
}
//喜欢某条评论
export const likeGossipComment = ({ data, toast }) => {
    return request({
        url: '/gossip/comment/like',
        method: 'put',
        data: data,
        toast: toast
    })
}
//删除某条评论
export const deleteGossipComment = ({ data, toast }) => {
    return request({
        url: '/gossip/comment/delete',
        method: 'Delete',
        data: data,
        toast: toast
    })
}