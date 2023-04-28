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
                state.info = {...state.info, avatar: action.payload}
            } else {
                state.info.avatar = action.payload
            }
        },
        setBackground: (state, action) => {
            if(state.info === null) {
                state.info = {...state.info, background: 'http://image.superarilo.icu/defalut_bg.jpg'}
            } else {
                state.info.background = action.background
            }
        }
    }
})
const store = configureStore(
    { reducer: { isMobile: isMobile.reducer, userInfo: userInfo.reducer } }
)
export default store
