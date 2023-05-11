import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Toaster } from 'react-hot-toast'
import './assets/scss/App.scss'
import './assets/fontawesome/css/all.min.css'
// import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
import { AliveScope } from 'react-activation'
const root = ReactDOM.createRoot(document.getElementById('react-by-asukamis'))
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <AliveScope>
                <App />
            </AliveScope>
            <Toaster
                position='bottom-right'
                containerStyle={{
                    fontSize: '0.8rem'
                }}/>
        </BrowserRouter>
    </Provider>
)
// reportWebVitals(console.log)
