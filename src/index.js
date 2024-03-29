import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Toaster } from 'react-hot-toast'
import './assets/scss/App.scss'
import { BrowserRouter } from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
const root = ReactDOM.createRoot(document.getElementById('react-by-asukamis'))
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
            <Toaster
                position='bottom-right'
                containerStyle={{
                    fontSize: '0.8rem'
                }}/>
        </BrowserRouter>
    </Provider>
)
