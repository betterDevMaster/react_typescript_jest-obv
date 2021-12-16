import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Form from 'Event/template/FiftyBlog/Dashboard/Faqs/FaqEditDialog/Form'
import Dialog from 'lib/ui/Dialog'
import {useFaqs} from 'organization/Event/FaqsProvider'

export default function FaqEditDialog(props: {isEditMode?: boolean}) {
  if (!props.isEditMode) {
    return null
  }
  return <Content />
}

function Content() {
  const {editing, edit} = useFaqs()

  const visible = Boolean(editing)

  const stopEditing = () => edit(null)

  if (!editing) {
    return null
  }

  return (
    <Dialog open={visible} onClose={stopEditing} fullWidth disableEnforceFocus>
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <Form faq={editing} onDone={stopEditing} />
      </DialogContent>
    </Dialog>
  )
}
