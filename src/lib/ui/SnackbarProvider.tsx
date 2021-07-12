import React, {useState} from 'react'
import {SnackbarProvider as NotiStackProvider} from 'notistack'
import {makeStyles} from '@material-ui/core'
import {useSnackbar as useNotiStackSnackbar} from 'notistack'

const MAX_SNACKBAR_ON_SCREEN = 3

type SnackbarContextProps = {
  setBackgroundColor: (color?: string) => void
  setTextColor: (color?: string) => void
}

const SnackbarContext = React.createContext<SnackbarContextProps | undefined>(
  undefined,
)
const DEFAULT_SNACKBAR_SUCCESS_BACKGROUND_COLOR = '#3e7954'
const DEFAULT_SNACKBAR_SUCCESS_COLOR = '#FFFFFF'

export default function SnackbarProvider(props: {children: React.ReactNode}) {
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>(
    DEFAULT_SNACKBAR_SUCCESS_BACKGROUND_COLOR,
  )
  const [textColor, setTextColor] = useState<string | undefined>(
    DEFAULT_SNACKBAR_SUCCESS_COLOR,
  )

  const useStyles = makeStyles({
    success: {
      backgroundColor: `${
        backgroundColor || DEFAULT_SNACKBAR_SUCCESS_BACKGROUND_COLOR
      } !important`,
      color: `${textColor || DEFAULT_SNACKBAR_SUCCESS_COLOR} !important`,
    },
  })
  const classes = useStyles()

  return (
    <SnackbarContext.Provider
      value={{
        setBackgroundColor,
        setTextColor,
      }}
    >
      <NotiStackProvider
        classes={{
          variantSuccess: classes.success,
        }}
        maxSnack={MAX_SNACKBAR_ON_SCREEN}
      >
        {props.children}
      </NotiStackProvider>
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  const notiStackContext = useNotiStackSnackbar()

  const context = React.useContext(SnackbarContext)
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }

  return {
    ...context,
    ...notiStackContext,
  }
}
