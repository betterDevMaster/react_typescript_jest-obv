import React from 'react'
import ReactDOM from 'react-dom'
import 'normalize.css'
import App from './App'
import 'index.css'
import StoreProvider from 'store/StoreProvider'

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('root'),
)
