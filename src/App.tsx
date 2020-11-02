import React from 'react'
import Dashboard from 'Dashboard'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import StoreProvider from 'store/StoreProvider'
import {ColorPickerPopover} from 'lib/ui/ColorPicker'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import {fakePoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import RulesProvider from 'Dashboard/component-rules/RulesProvider'

const dashboard = fakeSimpleBlog({
  primaryColor: '#ea202e',
  points: fakePoints(),
  sidebar: {
    background: '#000000',
    textColor: '#Ffffff',
  },
})

const user = fakeUser({group: 'foobar'})

export default function App() {
  return (
    <Providers>
      <RulesProvider tags={['foo', 'baz']} groups={user}>
        <Dashboard
          // @ts-ignore
          dashboard={dashboard}
          // @ts-ignore
          user={user}
          isEditMode={true}
        />
        <ColorPickerPopover />
      </RulesProvider>
    </Providers>
  )
}

export function Providers(props: {children: React.ReactNode}) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          {props.children}
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}
