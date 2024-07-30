import { createSlice, configureStore } from '@reduxjs/toolkit'

const isMobile = createSlice({
    name: 'isMobile',
    initialState: {
        status: null
    },
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload
        }
    }
})
const userInfo = createSlice({
    name: 'userInfo',
    initialState: {
        info: null 
    },
    reducers: {
        setInfo: (state, action) => {
            state.info = action.payload
        },
        setAvatar: (state, action) => {
            if(state.info === null) {
                state.info = { ...state.info, avatar: action.payload }
            } else {
                state.info.avatar =  action.payload 
            }
        },
        setBackground: (state, action) => {
            if(state.info === null) {
                state.info = { ...state.info, background: 'https://image.superarilo.icu/defalut_bg.jpg' }
            } else {
                state.info.background = action.payload
            }
        },
    }
})
const pushNotice = createSlice({
    name: 'pushNotice',
    initialState: {
        instance: []
    },
    reducers: {
        setPushNotice: (state, action) => {
            state.instance = action.payload
        }
    }
})
const Theme = createSlice({
    name: 'theme',
    initialState: {
        isDark: false
    },
    reducers: {
        setTheme: (state, action) => {
            state.isDark = action.payload
        }
    }
})
const store = configureStore(
    { reducer: { isMobile: isMobile.reducer, userInfo: userInfo.reducer, pushNotice: pushNotice.reducer, theme: Theme.reducer } }
)
export default store
