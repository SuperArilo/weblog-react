import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ 
    easing: 'ease',
    speed: 1000,
    showSpinner: true,
    trickleSpeed: 200,
    minimum: 0.2
})
export const start = ()=>{
    NProgress.start()
}
export const close = ()=>{
    NProgress.done()
}