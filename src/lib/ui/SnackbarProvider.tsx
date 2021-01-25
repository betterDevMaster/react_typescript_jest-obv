import React from 'react'
import {SnackbarProvider as NotiStackProvider} from 'notistack'

const MAX_SNACKBAR_ON_SCREEN = 3

export default function SnackbarProvider(props: {children: React.ReactNode}) {
  return (
    <NotiStackProvider maxSnack={MAX_SNACKBAR_ON_SCREEN}>
      {props.children}
    </NotiStackProvider>
  )
}
