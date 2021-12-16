import React from 'react'
import {ColorPickerPopover} from 'lib/ui/ColorPicker'
import {BrowserRouter as Router} from 'react-router-dom'
import {GlobalStyles} from 'lib/ui/theme/GlobalStyles'
import Routes from 'Routes'
import {useAnalytics} from 'analytics'
import ScrollOnNav from 'lib/ScrollOnNav'
import GlobalCss from 'lib/styles/GlobalCss'

export default function App() {
  useAnalytics()

  return (
    <>
      <GlobalStyles />
      <GlobalCss />
      <Router>
        <Routes />
        <ScrollOnNav />
      </Router>
      <ColorPickerPopover />
    </>
  )
}
