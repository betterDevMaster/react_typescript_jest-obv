import React from 'react'
import styled from 'styled-components'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import grey from '@material-ui/core/colors/grey'
import IconButton from 'lib/ui/IconButton'
import EditSpeakerPageForm from 'organization/Event/SpeakerPageConfig/SpeakerPageEditDialog/Form'

export default function SpeakerPageEditDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props

  return (
    <Dialog
      open={visible}
      onClose={props.onClose}
      fullWidth
      disableEnforceFocus
    >
      <CloseButton onClick={props.onClose} aria-label="close config dialog">
        <CloseIcon fontSize="small" />
      </CloseButton>
      <DialogTitle>Speakers Page</DialogTitle>
      <DialogContent>
        <EditSpeakerPageForm onClose={onClose} />
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
