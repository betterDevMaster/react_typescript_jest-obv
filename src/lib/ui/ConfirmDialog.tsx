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
  children: (confirm: () => void) => React.ReactElement
  description: string
}) {
  const {flag: isVisible, toggle: toggleVisible} = useToggle()

  const handleConfirm = () => {
    toggleVisible()
    props.onConfirm()
  }

  return (
    <>
      <Dialog open={isVisible} onClose={toggleVisible}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>{props.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggleVisible} color="primary">
            Cancel
          </Button>
          <DangerButton onClick={handleConfirm} aria-label="confirm">
            Confirm
          </DangerButton>
        </DialogActions>
      </Dialog>

      {props.children(toggleVisible)}
    </>
  )
}
