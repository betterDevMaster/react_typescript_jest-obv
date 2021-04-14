import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {Sponsor} from 'Event'
import Form from 'organization/Event/SponsorPageConfig/FieldEditDialog/Form'
import Dialog from 'lib/ui/Dialog'

export default function EditDialog(props: {
  onClose: () => void
  sponsor: Sponsor | null
  onUpdate: (sponsor: Sponsor) => void
  onRemove: (sponsor: Sponsor) => void
}) {
  const {sponsor} = props
  const visible = Boolean(sponsor)

  if (!sponsor) {
    return null
  }
  return (
    <Dialog open={visible} onClose={props.onClose} fullWidth>
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <Form
          sponsor={sponsor}
          onUpdate={props.onUpdate}
          onRemove={props.onRemove}
        />
      </DialogContent>
    </Dialog>
  )
}
