import React from 'react'
import Dashboard from 'Dashboard'
import ThemeProvider from 'ui/theme/ThemeProvider'
// import {fakeSimpleBlog} from 'Dashboard/templates/SimpleBlog/__utils__/factory'
// import {fakeUser} from 'user/__utils__/factory'
// import {fakePoints} from 'Dashboard/components/PointsSummary/__utils__/factory'

// const OBV_DASHBOARD = fakeSimpleBlog({
//   primaryColor: '#ea202e',
//   points: fakePoints(),
// })

// const OBV_USER = fakeUser()

function App() {
  return (
    <ThemeProvider>
      <Dashboard
        // @ts-ignore
        dashboard={OBV_DASHBOARD}
        // @ts-ignore
        user={OBV_USER}
      />
    </ThemeProvider>
  )
}

export default App
