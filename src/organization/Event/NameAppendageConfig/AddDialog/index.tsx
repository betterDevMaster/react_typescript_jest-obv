import Dialog from '@material-ui/core/Dialog'
import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import grey from '@material-ui/core/colors/grey'
import IconButton from 'lib/ui/IconButton'
import styled from 'styled-components'
import NameAppendageAddForm from "organization/Event/NameAppendageConfig/AddDialog/form";

export default function NameAppendageAddDialog(props: {
  isOpen: boolean
  onClose: () => void
}) {
  const visible = Boolean(props.isOpen)
  return (
    <Dialog open={visible} onClose={props.onClose} fullWidth>
      <CloseButton
        onClick={props.onClose}
        aria-label="close edit action dialog"
      >
        <CloseIcon fontSize="small" />
      </CloseButton>
      <DialogTitle>Add attendee label</DialogTitle>
      <DialogContent>
        <NameAppendageAddForm {...props} />
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
