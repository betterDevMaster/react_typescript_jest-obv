import React from 'react'
import Dashboard from 'Dashboard'
import ThemeProvider from 'system/ui/theme/ThemeProvider'
import {fakeSimpleBlog} from 'Dashboard/templates/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import {fakePoints} from 'Dashboard/component/PointsSummary/__utils__/factory'
import {fakeNavButton} from 'Dashboard/component/NavButton/__utils__/factory'
import StoreProvider from 'store/StoreProvider'

const dashboard = fakeSimpleBlog({
  primaryColor: '#ea202e',
  points: fakePoints(),
  sidebarBackground: '#000000',
  sidebarTextColor: '#Ffffff',
  sidebarNavButtons: Array.from({length: 5}, fakeNavButton),
})

export default function App() {
  return (
    <Providers>
      <Dashboard
        // @ts-ignore
        dashboard={dashboard}
        // @ts-ignore
        user={fakeUser()}
        isEditMode={false}
      />
    </Providers>
  )
}

export function Providers(props: {children: React.ReactElement}) {
  return (
    <StoreProvider>
      <ThemeProvider>{props.children}</ThemeProvider>
    </StoreProvider>
  )
}
