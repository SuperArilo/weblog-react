import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        count: 0,
    },
    reducers: {
        increment: (state) => {
            state.count += 1
        },
        decrement: (state) => {
            state.count -= 1
        },
        incrementByAmount: (state, action) => {
            state.count += action.payload
        },
    },
})
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

const store = configureStore(
    { reducer: { counter: counterSlice.reducer, isMobile: isMobile.reducer } }
)
export default store
