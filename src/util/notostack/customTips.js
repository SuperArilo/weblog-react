import { useSnackbar } from 'notistack'

let useSnackbarRef
export const SnackbarUtilsConfigurator = () => {
    useSnackbarRef = useSnackbar()
    return null
}
const success = (message) => {
    useSnackbarRef.enqueueSnackbar(message, { variant: 'success', autoHideDuration: 2000})
}
const warning = (message) => {
    useSnackbarRef.enqueueSnackbar(message, { variant: 'warning', autoHideDuration: 2000})
}
const info = (message) => {
    useSnackbarRef.enqueueSnackbar(message, { variant: 'info', autoHideDuration: 2000})
}
const error = (message) => {
    useSnackbarRef.enqueueSnackbar(message, { variant: 'error', autoHideDuration: 2000})
}
// eslint-disable-next-line
export default { success, warning, info, error }