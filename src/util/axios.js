import axios from 'axios'
axios.defaults.withCredentials = false
const service = axios.create({
    baseURL: 'http://localhost:3090/api',
    timeout: 10000
})
service.interceptors.request.use( config => {
    if(localStorage.getItem('token') === null){
        return config
    }
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
        if(error.response) {
            return Promise.reject(error.response.data)
        } else {
            error.message = '无法完成请求！'
            return Promise.reject(error)
        }
        
    }
)
export default service