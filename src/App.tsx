import React from 'react'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import StoreProvider from 'store/StoreProvider'
import {ColorPickerPopover} from 'lib/ui/ColorPicker'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import {BrowserRouter as Router} from 'react-router-dom'
import {getSubdomain} from 'lib/url'
import ObvioRoutes from 'obvio/Routes'
import OrganizationRoutes from 'organization/Routes'

export default function App() {
  return (
    <Providers>
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

function Routes() {
  const subdomain = getSubdomain(window.location.host)

  const isObvio = subdomain === 'app'
  if (!subdomain || isObvio) {
    return <ObvioRoutes />
  }

  return <OrganizationRoutes />
}
