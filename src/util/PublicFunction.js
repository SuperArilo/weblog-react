export const parseFormData = (obj) => {
    let data = new FormData()
    if (obj == null) return
    Object.keys(obj).map(key => {
        data.append(key, obj[key])
        return null
    })
    return data
}
export const ConvertToFormData = obj => {
    const formData = new FormData()
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            formData.append(key, obj[key])
        }
    }
    return formData
}
//生成固定范围的随机数
export const RandomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
//生成随机颜色
export const RandomRGB = () => {
    return [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
    ]
}
export const formatDateTime = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}