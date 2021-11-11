import Button, {ButtonProps} from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import {useToggle} from 'lib/toggle'
import DangerButton from 'lib/ui/Button/DangerButton'
import Dialog from 'lib/ui/Dialog'
import React from 'react'

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
        <DialogContent>
          <Content>{props.description}</Content>
        </DialogContent>
        <DialogActions>
          <CancelButton
            dialogVariant={variant}
            onClick={handleCancel}
            autoFocus
          />
          <ConfirmButton
            dialogVariant={variant}
            onClick={handleConfirm}
            aria-label="confirm"
          >
            {confirmLabel}
          </ConfirmButton>
        </DialogActions>
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
    dialogVariant === 'dangerous' ? 'primary' : 'default'

  return (
    <Button {...buttonProps} color={color}>
      Cancel
    </Button>
  )
}

function ConfirmButton(
  props: ButtonProps & {dialogVariant: ConfirmationDialogVariant},
) {
  const {dialogVariant, ...buttonProps} = props
  if (dialogVariant === 'dangerous') {
    return <DangerButton {...buttonProps} />
  }

  return <Button {...buttonProps} color="primary" />
}

function Content(props: {children: string | React.ReactElement}) {
  // If we're supplied a component for description, we'll
  // just render that as-is.
  if (typeof props.children === 'object') {
    return props.children
  }

  return <Typography>{props.children}</Typography>
}
