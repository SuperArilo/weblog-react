import axios from 'axios'
axios.defaults.withCredentials = false
const service = axios.create({
    baseURL: 'http://172.24.1.69:3090/api',
    timeout: 120000
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
        return Promise.reject(error.response.data)
    }
)
export default service