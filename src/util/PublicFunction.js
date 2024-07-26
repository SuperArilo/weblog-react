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