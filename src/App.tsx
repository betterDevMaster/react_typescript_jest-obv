import React from 'react'
import faker from 'faker'
import Dashboard from 'Dashboard'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import {fakePoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import StoreProvider from 'store/StoreProvider'
import {ColorPickerPopover} from 'lib/ui/ColorPicker'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import {fakeAgenda} from 'Dashboard/components/AgendaList/__utils__/factory'

const dashboard = fakeSimpleBlog({
  primaryColor: '#ea202e',
  points: fakePoints(),
  sidebar: {
    background: '#000000',
    textColor: '#Ffffff',
  },
  agendas: Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    fakeAgenda,
  ),
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
      <ThemeProvider>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          {props.children}
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}
