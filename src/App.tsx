import React from 'react'
import Dashboard from 'Dashboard'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import {fakePoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import StoreProvider from 'store/StoreProvider'
import {ColorPickerPopover} from 'lib/ui/ColorPicker'

const dashboard = fakeSimpleBlog({
  primaryColor: '#ea202e',
  points: fakePoints(),
  sidebarBackground: '#000000',
  sidebarTextColor: '#Ffffff',
})

export default function App() {
  return (
    <Providers>
      <Dashboard
        // @ts-ignore
        dashboard={dashboard}
        // @ts-ignore
        user={fakeUser()}
        isEditMode={true}
      />
      <ColorPickerPopover />
    </Providers>
  )
}

export function Providers(props: {children: React.ReactNode}) {
  return (
    <StoreProvider>
      <ThemeProvider>{props.children}</ThemeProvider>
    </StoreProvider>
  )
}
