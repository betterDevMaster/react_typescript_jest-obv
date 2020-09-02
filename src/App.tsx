import React from 'react'
import './App.css'
import Event from 'Event'

function App() {
  return (
    <Event
      //@ts-ignore
      event={EVENT_DATA}
    />
  )
}

export default App
