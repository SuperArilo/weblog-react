import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './store/index.js'
import { BrowserRouter } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import './assets/scss/App.scss'

ReactDOM.createRoot(document.getElementById('react-by-asukamis')).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
            <Toaster
                position='bottom-right'
                containerStyle={{
                    fontSize: '0.8rem'
                }} />
        </BrowserRouter>
    </Provider>
)
