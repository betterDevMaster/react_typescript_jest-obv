import React from 'react'
import styled from 'styled-components'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import grey from '@material-ui/core/colors/grey'
import IconButton from 'lib/ui/IconButton'
import {useTemplate} from 'Event/TemplateProvider'
import Content from 'lib/ui/form/TextEditor/Content'
import {useAttendeeVariables} from 'Event'
import UploadImageForm from 'Event/Dashboard/components/NavButton/ImageEntryUpload/UploadDialog/Form'

export default function UploadDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props

  const template = useTemplate()
  const {imageWaterfall: formSettings} = template

  const v = useAttendeeVariables()

  return (
    <Dialog
      open={visible}
      onClose={props.onClose}
      fullWidth
      disableEnforceFocus
    >
      <CloseButton onClick={props.onClose} aria-label="close upload dialog">
        <CloseIcon fontSize="small" />
      </CloseButton>
      <DialogTitle>{formSettings.uploadFormTitle}</DialogTitle>
      <DialogContent>
        <SubTitle>
          <Content aria-label="upload form description">
            {v(formSettings.uploadFormDescription)}
          </Content>
        </SubTitle>
        <UploadImageForm onClose={onClose} />
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

const SubTitle = styled.div`
  text-align: center;
  margin: 20px 20px;
`
