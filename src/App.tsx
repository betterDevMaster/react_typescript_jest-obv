import React from 'react'
import './App.css'
import Dashboard from 'Dashboard'

function App() {
  return (
    <Dashboard
      //@ts-ignore
      dashboard={EVENT_DATA}
    />
  )
}

export default App
