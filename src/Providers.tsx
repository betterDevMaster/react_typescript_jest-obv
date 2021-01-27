import MomentUtils from '@date-io/moment'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import BreadcrumbProvider from 'lib/ui/BreadcrumbProvider'
import SnackbarProvider from 'lib/ui/SnackbarProvider'
import ThemeProvider from 'lib/ui/theme/ThemeProvider'
import React from 'react'

export default function Providers(props: {
  children: React.ReactNode
  // Allows passing in a mocked store provider for tests
  storeProvider: React.FunctionComponent<{children: React.ReactNode}>
}) {
  const StoreProvider = props.storeProvider

  return (
    <StoreProvider>
      <ThemeProvider>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider>
            <BreadcrumbProvider>{props.children}</BreadcrumbProvider>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}
