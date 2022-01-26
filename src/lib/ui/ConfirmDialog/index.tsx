import React from 'react'
import styled from 'styled-components'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'

import Button, {ButtonProps} from 'lib/ui/Button'
import Box from 'lib/ui/Box'
import {useToggle} from 'lib/toggle'

const DEFAULT_TITLE = 'Are you sure?'
const DEFAULT_CONFIRM_LABEL = 'Confirm'

type ConfirmationDialogVariant = 'info' | 'dangerous'

export default function ConfirmDialog(props: {
  onConfirm: () => void
  children?: (confirm: () => void) => React.ReactElement
  description: string | React.ReactElement
  showing?: boolean
  title?: string
  onCancel?: () => void
  confirmLabel?: string
  variant?: ConfirmationDialogVariant
  skip?: boolean
  buttonsDisplay?: 'horizontally' | 'vertically'
}) {
  const {showing, onCancel} = props
  const {flag: isVisible, toggle: toggleVisible} = useToggle()

  const handleConfirm = () => {
    // Handling visibility internally
    if (showing === undefined) {
      toggleVisible()
    }

    props.onConfirm()
  }

  const handleAction = () => {
    if (props.skip) {
      props.onConfirm()
      return
    }

    toggleVisible()
  }

  /**
   * If visibility is specified by parent, we'll prefer that. Otherwise
   * manage it internally.
   */
  const open = showing === undefined ? isVisible : showing

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
      return
    }

    toggleVisible()
  }

  const title = props.title || DEFAULT_TITLE
  const confirmLabel = props.confirmLabel || DEFAULT_CONFIRM_LABEL

  const variant: ConfirmationDialogVariant = props.variant || 'dangerous'

  return (
    <>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>{title}</DialogTitle>
        <StyledDialogContent>
          <Content>{props.description}</Content>
        </StyledDialogContent>
        <StyledDialogAction disableSpacing>
          <Box
            display={props.buttonsDisplay === 'vertically' ? 'block' : 'flex'}
          >
            <ButtonContainer>
              <ConfirmButton
                dialogVariant={variant}
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                aria-label="confirm"
              >
                {confirmLabel}
              </ConfirmButton>
            </ButtonContainer>
            <ButtonContainer>
              <CancelButton
                dialogVariant={variant}
                variant="contained"
                color="primary"
                onClick={handleCancel}
              >
                Cancel
              </CancelButton>
            </ButtonContainer>
          </Box>
        </StyledDialogAction>
      </Dialog>
      {props.children && props.children(handleAction)}
    </>
  )
}

function CancelButton(
  props: ButtonProps & {dialogVariant: ConfirmationDialogVariant},
) {
  const {dialogVariant, ...buttonProps} = props
  const color: ButtonProps['color'] =
    dialogVariant === 'dangerous' ? 'primary' : 'grey'

  return (
    <Button {...buttonProps} color={color} fullWidth>
      Cancel
    </Button>
  )
}

function ConfirmButton(
  props: ButtonProps & {dialogVariant: ConfirmationDialogVariant},
) {
  const {dialogVariant, ...buttonProps} = props
  if (dialogVariant === 'dangerous') {
    return <Button {...buttonProps} color="danger" fullWidth />
  }

  return <Button {...buttonProps} color="primary" fullWidth />
}

function Content(props: {children: string | React.ReactElement}) {
  // If we're supplied a component for description, we'll
  // just render that as-is.
  if (typeof props.children === 'object') {
    return props.children
  }

  return <Typography>{props.children}</Typography>
}

const StyledDialogAction = styled(DialogActions)`
  justify-content: center !important;
  background-color: #f1f1f1;
`

const StyledDialogContent = styled(DialogContent)`
  background-color: #f1f1f1;
`

const ButtonContainer = styled(Box)`
  width: 220px;
  padding: ${(props) => props.theme.spacing[1]};
`
