import Dialog from '@material-ui/core/Dialog'
import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import grey from '@material-ui/core/colors/grey'
import IconButton from 'lib/ui/IconButton'
import styled from 'styled-components'
// import AdditionalWaiverUpdateForm from 'organization/Event/WaiverConfig/AdditionalWaivers/UpdateDialog/form'
import Form from 'organization/Event/WaiverConfig/AdditionalWaivers/ConfigDialog/Form'
import {WaiverConfig} from 'Event'

export type TargetWaiver = WaiverConfig & {
  // Optional id if its already been saved
  id?: number
}

export default function ConfigDialog(props: {
  onClose: () => void
  target: TargetWaiver | null
}) {
  const {target, onClose} = props
  if (!target) {
    return null
  }

  return (
    <Dialog open onClose={onClose} fullWidth>
      <CloseButton
        onClick={props.onClose}
        aria-label="close additional waiver config"
      >
        <CloseIcon fontSize="small" />
      </CloseButton>
      <DialogTitle>Additional Waiver</DialogTitle>
      <DialogContent>
        <Form waiver={target} onDone={onClose} />
      </DialogContent>
    </Dialog>
  )
}

const CloseButton = styled(IconButton)`
  position: absolute;
  top: ${(props) => props.theme.spacing[2]};
  right: ${(props) => props.theme.spacing[2]};

  svg {
    color: ${grey[500]};
  }
`
