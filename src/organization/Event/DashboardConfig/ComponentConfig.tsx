import React from 'react'
import styled from 'styled-components'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button, {ButtonProps} from '@material-ui/core/Button'

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

export const SaveButton = (props: ButtonProps) => (
  <StyledSaveButton
    fullWidth
    variant="contained"
    color="primary"
    type="submit"
    aria-label="save"
    {...props}
  >
    SAVE
  </StyledSaveButton>
)

const StyledSaveButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[4]}!important;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`

const StyledDialogContent = styled(DialogContent)`
  padding-bottom: ${(props) => props.theme.spacing[2]}!important;
`