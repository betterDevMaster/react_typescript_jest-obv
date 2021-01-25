import Dialog from '@material-ui/core/Dialog'
import {Action} from 'Event/ActionsProvider'
import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import grey from '@material-ui/core/colors/grey'
import IconButton from 'lib/ui/IconButton'
import styled from 'styled-components'
import Form from 'organization/Event/PointsConfig/ActionEditDialog/Form'

export default function ActionEditDialog(props: {
  action: Action | null
  onClose: () => void
}) {
  const visible = Boolean(props.action)
  return (
    <Dialog open={visible} onClose={props.onClose} fullWidth>
      <CloseButton
        onClick={props.onClose}
        aria-label="close edit action dialog"
      >
        <CloseIcon fontSize="small" />
      </CloseButton>
      <DialogTitle>Edit</DialogTitle>
      <DialogContent>
        <StyledForm action={props.action} onComplete={props.onClose} />
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

const StyledForm = styled(Form)`
  margin-bottom: ${(props) => props.theme.spacing[5]};
`
