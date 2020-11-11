import React from 'react'
import ReactDOM from 'react-dom'
import 'normalize.css'
import App from './App'

export const isProduction = process.env.NODE_ENV === 'production'
export const appRoot = process.env.REACT_APP_WEB_APP_ROOT

ReactDOM.render(<App />, document.getElementById('root'))
