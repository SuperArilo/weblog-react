import toast from 'react-hot-toast'

const share = ({ title, prefx, text }) => {
    if(window.navigator.share === undefined) {
        toast('当前浏览器不支持此API')
        return
    }
    window.navigator.share({
        title: title,
        url: `http://192.168.1.2/${prefx}`,
        text: text
    })
}
export default share