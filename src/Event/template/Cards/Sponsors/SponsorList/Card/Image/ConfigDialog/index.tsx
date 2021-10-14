import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {Sponsor} from 'Event/SponsorPage'
import Dialog from 'lib/ui/Dialog'
import Form from 'Event/template/Cards/Sponsors/SponsorList/Card/Image/ConfigDialog/Form'

export default function ConfigDialog(props: {
  onClose: () => void
  visible: boolean
  sponsor: Sponsor
}) {
  const {sponsor, visible} = props

  return (
    <Dialog open={visible} onClose={props.onClose} fullWidth>
      <DialogTitle>Edit Image</DialogTitle>
      <DialogContent>
        <Form sponsor={sponsor} onDone={props.onClose} />
      </DialogContent>
    </Dialog>
  )
}
