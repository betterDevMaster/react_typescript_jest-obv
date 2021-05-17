import React from 'react'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DangerButton from 'lib/ui/Button/DangerButton'
import {Form} from 'organization/Event/FormsProvider'

export default function EditFormDialog(props: {
  form: Form | null
  onClose: () => void
  onRemove: (form: Form) => void
}) {
  const {form, onClose, onRemove} = props
  const visible = Boolean(form)

  const handleRemove = () => {
    if (!form) {
      return
    }

    onRemove(form)
    onClose()
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth>
      <DialogTitle>Remove Form</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <RemoveButton
            fullWidth
            variant="contained"
            aria-label="remove form"
            onClick={handleRemove}
          >
            REMOVE
          </RemoveButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[5]}!important;
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
