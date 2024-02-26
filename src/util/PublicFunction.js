export const parseFormData = (obj) => {
    let data = new FormData()
    if (obj == null) return
    Object.keys(obj).map(key => {
        data.append(key, obj[key])
        return null
    })
    return data
}