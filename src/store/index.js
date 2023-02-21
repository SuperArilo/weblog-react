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
        info: {}
    },
    reducers: {
        setInfo: (state, action) => {
            state.info = action.payload
        },
        setAvatar: (state, action) => {
            state.info.avatar = action.payload
        }
    }
})
const store = configureStore(
    { reducer: { isMobile: isMobile.reducer, userInfo: userInfo.reducer } }
)
export default store
