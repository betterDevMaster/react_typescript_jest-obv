import Dialog from '@material-ui/core/Dialog'
import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import grey from '@material-ui/core/colors/grey'
import IconButton from 'lib/ui/IconButton'
import styled from 'styled-components'
import {NameAppendage} from 'organization/Event/NameAppendageConfig/NameAppendageProvider'
import NameAppendageUpdateForm from 'organization/Event/NameAppendageConfig/UpdateDialog/form'

export default function NameAppendageUpdateDialog(props: {
  onClose: () => void
  nameAppendage: NameAppendage | null
}) {
  if (!props.nameAppendage) {
    return null
  }

  return (
    <Dialog open={true} onClose={props.onClose} fullWidth>
      <CloseButton
        onClick={props.onClose}
        aria-label="close edit action dialog"
      >
        <CloseIcon fontSize="small" />
      </CloseButton>
      <DialogTitle>Update attendee label</DialogTitle>
      <DialogContent>
        <NameAppendageUpdateForm {...props} />
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
