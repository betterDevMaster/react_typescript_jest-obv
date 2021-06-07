import React from 'react'
import Box from '@material-ui/core/Box'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormSelect from 'organization/Event/FormsProvider/FormSelect'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import {Form, useForms} from 'organization/Event/FormsProvider'

export default function AddNewFormDialog(props: {
  visible: boolean
  onClose: () => void
  onAdd: (form: Form) => void
}) {
  const {visible, onClose} = props

  const {forms} = useForms()

  const handleSelectedForm = (id: number | null) => {
    if (!id) {
      props.onClose()
      return
    }

    const target = forms.find((f) => f.id === id)
    if (!target) {
      throw new Error(
        `Missing form with id: ${id}. This should not be happening.`,
      )
    }

    props.onAdd(target)
  }

  if (!visible) {
    return null
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Add Form</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <FormControl fullWidth>
            <InputLabel>Form</InputLabel>
            <FormSelect onChange={handleSelectedForm} />
          </FormControl>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
