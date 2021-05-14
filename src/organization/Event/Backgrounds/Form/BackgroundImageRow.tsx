import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {
  Background,
  BackgroundsTemplateData,
  ImagePreviewContainer,
} from 'organization/Event/Backgrounds/BackgroundsProvider'
import BackgroundImageEditDialog from 'organization/Event/Backgrounds/Form/BackgroundImageEditDialog'
import {setEvent} from 'Event/state/actions'
import { ObvioEvent } from 'Event'

export default function BackgroundImageRow(
  props: {
    settings: BackgroundsTemplateData,
    background: Background
    isRemoving: boolean
    remove: () => void
  }
) {
  const [visibleEditDialog, setVisibleEditDialog] = useState(false)
  const {settings, background, isRemoving, remove} = props

  const toggleEditDialog = () => setVisibleEditDialog(!visibleEditDialog)

  const handleRemove = () => {
    setVisibleEditDialog(false)
    toggleEditDialog()
    remove()
  }

  const onDone = (event: ObvioEvent) => {
    setEvent(event)
    toggleEditDialog()
  }

  return (
    <DraggableBox>
      <ImagePreviewContainer
        alt="background"
        borderRadius={settings.borderRadius}
        borderThickness={settings.borderThickness}
        borderColor={settings.borderColor}
        clickable={false}
        src={background.image.url}
        width="200"
      />
      <Button
        type="button"
        variant="contained"
        color="primary"
        disabled={isRemoving}
        aria-label="edit"
        onClick={toggleEditDialog}
      >
        Edit
      </Button>
      <BackgroundImageEditDialog
        onClose={toggleEditDialog}
        visible={visibleEditDialog}
        background={background}
        settings={settings}
        handleRemove={handleRemove}
        onDone={onDone}
      />
    </DraggableBox>
  )
}

const DraggableBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${(props) => props.theme.spacing[2]};
  padding-bottom: ${(props) => props.theme.spacing[2]};
`
