import axios from 'axios'
axios.defaults.withCredentials = true
const service = axios.create({
    // baseURL: 'http://localhost:3090/api',
    baseURL: 'http://139.155.94.20:3090/api',
    timeout: 15000
})
service.interceptors.request.use( config => {
    if(localStorage.getItem('token') !== null){
        config.headers.token = localStorage.getItem('token')
        return config
    }
    return config
}, error => {
    return Promise.reject(error)
})
service.interceptors.response.use( response => {
        return Promise.resolve(response.data)
    }, error => {
        if(error.response) {
            return Promise.reject(error.response.data)
        } else {
            error.message = '无法完成请求，网络出错。请重新刷新页面'
            return Promise.reject(error)
        }
    }
)
export default service