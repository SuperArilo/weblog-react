import axios from 'axios'
import toast from 'react-hot-toast'
axios.defaults.withCredentials = true
const service = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? 'http://127.0.0.1/api':'https://blog.superarilo.icu/api',
    timeout: 60000
})
service.interceptors.request.use( config => {
    if(config.toast?.isShow) {
        config.toastId = toast.loading(config.toast?.loadingMessage ? config.toast.loadingMessage:'未设置')
    } 
    if(localStorage.getItem('token') !== null){
        config.headers.token = localStorage.getItem('token')
        return config
    }
    return config
}, error => {
    return Promise.reject(error)
})
service.interceptors.response.use( response => {
    if(response.config.toast?.isShow) {
        if(response.data.code === 200) {
            toast.success(response.data.message, { id: response.config.toastId })
        } else if(response.data.code === 0) {
            toast(response.data.message, { id: response.config.toastId })
        } else {
            toast.error(response.data.message, { id: response.config.toastId })
        }
    }
    return Promise.resolve(response.data)
}, error => {
    if(error.response) {
        toast.error(error.response.data.message, { id: error.response.config?.toastId })
        return Promise.reject(error.response.data)
    } else {
        toast.error('无法完成请求，网络出错。请重新刷新页面', { id: error.config?.toastId })
        return Promise.reject(error)
    }
})
export default service