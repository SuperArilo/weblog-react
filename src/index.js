import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/scss/App.scss'
import reportWebVitals from './reportWebVitals'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarUtilsConfigurator } from './util/notostack/customTips'
const root = ReactDOM.createRoot(document.getElementById('react-by-asukamis'))
root.render(
    <BrowserRouter>
        <SnackbarProvider maxSnack={ 4 } anchorOrigin={{ vertical: 'top', horizontal: 'center'}}>
            <App />
            <SnackbarUtilsConfigurator />
        </SnackbarProvider>
    </BrowserRouter>
)
reportWebVitals()
