import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import Button from '@material-ui/core/Button'

export default function UnableAssignRoleDialog(props: {
  message?: string
  onClose: () => void
}) {
  return (
    <Dialog open={Boolean(props.message)} onClose={props.onClose}>
      <DialogContent>
        <Typography>{props.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={props.onClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
