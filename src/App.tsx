import React from 'react'
import {ColorPickerPopover} from 'lib/ui/ColorPicker'
import {BrowserRouter as Router} from 'react-router-dom'
import {GlobalStyles} from 'lib/ui/theme/GlobalStyles'
import Routes from 'Routes'
import {useAnalytics} from 'analytics'

export const isProduction = process.env.NODE_ENV === 'production'
export const isTest = process.env.NODE_ENV === 'test'
export const isStaging = process.env.REACT_APP_IS_STAGING === 'true'
export const appRoot = process.env.REACT_APP_WEB_APP_ROOT
export const OBVIO_SUBDOMAIN = 'app'

export default function App() {
  useAnalytics()

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes />
      </Router>
      <ColorPickerPopover />
    </>
  )
}
