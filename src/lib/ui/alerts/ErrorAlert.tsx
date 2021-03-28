import Alert from '@material-ui/lab/Alert'
import React from 'react'

export default function ErrorAlert(props: {
  children?: string | null
  onClose?: () => void
  className?: string
}) {
  if (!props.children) {
    return null
  }

  return (
    <Alert severity="error" onClose={props.onClose} className={props.className}>
      {props.children}
    </Alert>
  )
}
