import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Form from 'Event/template/SimpleBlog/SpeakerPage/SpeakerEditDialog/Form'
import {useSpeakers} from 'organization/Event/SpeakersProvider'

export default function SpeakerEditDialog(props: {isEditMode?: boolean}) {
  if (!props.isEditMode) {
    return null
  }
  return <Content />
}

function Content() {
  const {editing, edit} = useSpeakers()

  const visible = Boolean(editing)

  const stopEditing = () => edit(null)

  if (!editing) {
    return null
  }

  return (
    <Dialog open={visible} onClose={stopEditing} fullWidth>
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <Form speaker={editing} onDone={stopEditing} />
      </DialogContent>
    </Dialog>
  )
}
