import React from 'react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import StoreProvider from 'store/StoreProvider'
import {ColorPickerPopover} from 'lib/ui/ColorPicker'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import {BrowserRouter as Router} from 'react-router-dom'
import {GlobalStyles} from 'lib/ui/theme/GlobalStyles'
import Routes from 'Routes'

export const isProduction = process.env.NODE_ENV === 'production'
export const appRoot = process.env.REACT_APP_WEB_APP_ROOT
export const OBVIO_SUBDOMAIN = 'app'

export default function App() {
  return (
    <Providers>
      <GlobalStyles />
      <Router>
        <Routes />
      </Router>
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
