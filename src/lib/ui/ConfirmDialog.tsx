import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import {useToggle} from 'lib/toggle'
import DangerButton from 'lib/ui/Button/DangerButton'
import Dialog from 'lib/ui/Dialog'
import React from 'react'

export default function ConfirmDialog(props: {
  onConfirm: () => void
  children?: (confirm: () => void) => React.ReactElement
  description: string
  showing?: boolean
  onCancel?: () => void
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

  return (
    <>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>{props.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <DangerButton onClick={handleConfirm} aria-label="confirm">
            Confirm
          </DangerButton>
        </DialogActions>
      </Dialog>
      {props.children && props.children(toggleVisible)}
    </>
  )
}
