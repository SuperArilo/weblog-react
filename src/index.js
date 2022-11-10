import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/scss/App.scss'
import reportWebVitals from './reportWebVitals'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'
const root = ReactDOM.createRoot(document.getElementById('react-by-asukamis'))
root.render(
    <BrowserRouter>
		<SnackbarProvider maxSnack={ 4 }>
            <App />
        </SnackbarProvider>	
	</BrowserRouter>
    
)
reportWebVitals()
