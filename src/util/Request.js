import axios from 'axios'
import toast from 'react-hot-toast'
axios.defaults.withCredentials = true
const service = axios.create({
    baseURL: `${window.location.protocol}//${window.location.hostname}/api`,
    timeout: 60000
})
service.interceptors.request.use(config => {
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
    switch(response.data.code) {
        case 0:
            if(response.config.toast?.isShow) {
                toast(response.data.message, { id: response.config.toastId })
            }
            return Promise.resolve(response.data)
        case 200:
            if(response.config.toast?.isShow) {
                toast(response.data.message, { id: response.config.toastId })
            }
            return Promise.resolve(response.data)
        case 401:
        case -1:
        case 403:
            toast.error(response.data.message, { id: response.config.toastId })
            localStorage.removeItem('token')
            return Promise.reject(response.data)
    }
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