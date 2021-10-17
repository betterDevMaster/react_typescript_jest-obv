import MuiAlert, {AlertProps as MuiAlertProps} from '@material-ui/lab/Alert'
import React from 'react'

export type AlertProps = {
  children?: string | null
  onClose?: () => void
  className?: string
  severity: NonNullable<MuiAlertProps['severity']>
}

export type AlertLevelProps = Omit<AlertProps, 'severity'>

export default function Alert(props: AlertProps) {
  if (!props.children) {
    return null
  }

  return (
    <MuiAlert
      severity={props.severity}
      onClose={props.onClose}
      className={props.className}
    >
      {props.children}
    </MuiAlert>
  )
}
