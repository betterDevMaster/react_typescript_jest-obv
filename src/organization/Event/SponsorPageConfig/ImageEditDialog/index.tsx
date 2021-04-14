import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {Sponsor} from 'Event'
import Dialog from 'lib/ui/Dialog'
import Form from 'organization/Event/SponsorPageConfig/ImageEditDialog/Form'

export default function EditDialog(props: {
  onClose: () => void
  sponsor: Sponsor | null
  onUpdate: (sponsor: Sponsor) => void
}) {
  const {sponsor} = props
  const visible = Boolean(sponsor)

  if (!sponsor) {
    return null
  }

  return (
    <Dialog open={visible} onClose={props.onClose} fullWidth>
      <DialogTitle>Edit Image</DialogTitle>
      <DialogContent>
        <Form sponsor={sponsor} onUpdate={props.onUpdate} />
      </DialogContent>
    </Dialog>
  )
}
