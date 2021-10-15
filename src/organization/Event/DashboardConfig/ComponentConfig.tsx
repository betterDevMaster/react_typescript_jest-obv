import React from 'react'
import styled from 'styled-components'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button, {ButtonProps} from '@material-ui/core/Button'
import DangerButton from 'lib/ui/Button/DangerButton'

export interface ComponentConfigProps {
  isVisible: boolean
  onClose: () => void
}

export default function ComponentConfig(
  props: ComponentConfigProps & {
    title: string
    children: React.ReactElement | React.ReactElement[]
  },
) {
  const {isVisible: visible, onClose, title, children} = props

  return (
    // Added 'disableEnforceFocus' to fix CKEditor link not being clickable
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>{title}</DialogTitle>
      <StyledDialogContent>{children}</StyledDialogContent>
    </Dialog>
  )
}

export const SaveButton = (props: ButtonProps & {children?: string}) => {
  const label = props.children || 'SAVE'
  return (
    <StyledSaveButton
      fullWidth
      variant="contained"
      color="primary"
      type="submit"
      aria-label="save"
      {...props}
    >
      {label}
    </StyledSaveButton>
  )
}

const StyledSaveButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[4]}!important;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`

const StyledDialogContent = styled(DialogContent)`
  padding-bottom: ${(props) => props.theme.spacing[2]}!important;
`

export type RemoveButtonProps = ButtonProps & {
  children?: string
  showing?: boolean
}

export const RemoveButton = (props: RemoveButtonProps) => {
  const label = props.children || 'REMOVE'

  /**
   * If we didn't specify a showing prop, let's show by default
   */
  const showing = props.showing === undefined ? true : props.showing

  return (
    <StyledRemoveButton
      fullWidth
      variant="outlined"
      aria-label="remove"
      showing={showing}
      {...props}
    >
      {label}
    </StyledRemoveButton>
  )
}

const StyledRemoveButton = styled((props: RemoveButtonProps) => {
  const {showing, ...otherProps} = props
  return <DangerButton {...otherProps} />
})`
  ${(props) => (props.showing ? '' : 'display: none;')}
  margin-top: ${(props) => props.theme.spacing[2]}!important;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`
