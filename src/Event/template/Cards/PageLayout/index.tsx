import {ThemeProvider} from '@material-ui/core/styles'
import {useCards} from 'Event/template/Cards'
import {useToggle} from 'lib/toggle'
import {muiDarkTheme, muiTheme} from 'lib/ui/theme'
import React from 'react'

export default function Page() {
  const {flag: showingMenu, toggle: toggleMenu} = useToggle()

  const muiTheme = useMuiTheme()

  return (
    <ThemeProvider theme={muiTheme}>
      <div>react</div>
    </ThemeProvider>
  )
}

function useMuiTheme() {
  const {template} = useCards()
  const {isDarkMode} = template

  return isDarkMode ? muiDarkTheme : muiTheme
}
