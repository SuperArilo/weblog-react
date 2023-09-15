const share = ({ title, prefx, text }, callBack) => {
    if(navigator.share === undefined) {
        callBack('浏览器不支持此组件API')
        return
    }
    navigator.share({
        title: title,
        url: `http://192.168.1.2/${prefx}`,
        text: text
    })
}
export default share