import NativeShare from 'nativeshare'
import toast from 'react-hot-toast'

const share = ({ title="未设置", desc="未设置", link="未设置", icon }) => {
    let nativeshare = new NativeShare()
    nativeshare.setShareData({
        title: title,
        desc: desc,
        link: link,
        icon: icon
    })
    try {
        nativeshare.call()
    } catch(e) {
        toast('当前浏览器暂不支持此API')
        console.log(e)
    }
}
export default share