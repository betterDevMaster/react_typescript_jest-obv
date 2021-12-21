import MuiAlert, {AlertProps as MuiAlertProps} from '@material-ui/lab/Alert'
import styled from 'styled-components'
import React from 'react'

export type AlertProps = {
  children?: string | null
  onClose?: () => void
  className?: string
  showing?: boolean
  severity: NonNullable<MuiAlertProps['severity']>
}

export type AlertLevelProps = Omit<AlertProps, 'severity'>

export default function Alert(props: AlertProps) {
  if (!props.children) {
    return null
  }

  if (props.showing !== undefined && !props.showing) {
    return null
  }

  return (
    <StyledAlert
      severity={props.severity}
      onClose={props.onClose}
      className={props.className}
    >
      {props.children}
    </StyledAlert>
  )
}

const StyledAlert = styled(MuiAlert)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
