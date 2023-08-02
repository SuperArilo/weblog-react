import axios from 'axios'
axios.defaults.withCredentials = true
const service = axios.create({
    baseURL: 'http://192.168.1.10:19198/api',
    // baseURL: 'https://blog.superarilo.icu/api',
    timeout: 60000
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