import axios from 'axios'
axios.defaults.withCredentials = false
const service = axios.create({
    // baseURL: 'http://localhost:3090/api',
    baseURL: 'http://139.155.94.20:3090/api',
    timeout: 10000
})
service.interceptors.request.use( config => {
    if(localStorage.getItem('token')){
        config.headers.token = localStorage.getItem('token')
        return config
    }
}, error => {
    return Promise.reject(error)
})
service.interceptors.response.use( response => {
        return Promise.resolve(response.data)
    }, error => {
        if((error.response && error.message) || error.response == null) {
            error.message = '无法完成请求，网络出错！'
            return Promise.reject(error)
        }
        if(error.response.data) {
            return Promise.reject(error.response.data)
        }
    }
)
export default service