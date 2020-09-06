import React from 'react'
import Dashboard from 'Dashboard'
import ThemeProvider from 'ui/theme/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      <Dashboard
        //@ts-ignore
        dashboard={OBV_DASHBOARD}
      />
    </ThemeProvider>
  )
}

export default App
