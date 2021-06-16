import React from 'react'
import {ColorPickerPopover} from 'lib/ui/ColorPicker'
import {BrowserRouter as Router} from 'react-router-dom'
import {GlobalStyles} from 'lib/ui/theme/GlobalStyles'
import Routes from 'Routes'
import {useAnalytics} from 'analytics'

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
