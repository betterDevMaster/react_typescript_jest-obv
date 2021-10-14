import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Form from 'Event/template/Cards/Sponsors/SponsorEditDialog/Form'
import Dialog from 'lib/ui/Dialog'
import {useSponsors} from 'organization/Event/SponsorsProvider'

export default function SponsorEditDialog(props: {isEditMode?: boolean}) {
  if (!props.isEditMode) {
    return null
  }
  return <Content />
}

function Content() {
  const {editing, edit} = useSponsors()

  const visible = Boolean(editing)

  const stopEditing = () => edit(null)

  if (!editing) {
    return null
  }

  return (
    <Dialog open={visible} onClose={stopEditing} fullWidth disableEnforceFocus>
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <Form sponsor={editing} onDone={stopEditing} />
      </DialogContent>
    </Dialog>
  )
}
