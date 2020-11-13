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
import {GlobalStyles} from 'lib/ui/theme/GlobalStyles'
import OrganizationProvider from 'organization/OrganizationProvider'

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

function Routes() {
  const subdomain = getSubdomain(window.location.host)

  const isObvio = subdomain === OBVIO_SUBDOMAIN
  if (!subdomain || isObvio) {
    return <ObvioRoutes />
  }

  return (
    <OrganizationProvider>
      <OrganizationRoutes />
    </OrganizationProvider>
  )
}
