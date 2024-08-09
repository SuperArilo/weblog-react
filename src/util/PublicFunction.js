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