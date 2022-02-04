import React, {useState} from 'react'
import styled from 'styled-components'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import {
  Background,
  useBackgrounds,
} from 'organization/Event/Backgrounds/BackgroundsProvider'
import BackgroundImage from 'Event/template/NiftyFifty/Dashboard/Resources/Backgrounds/BackgroundsConfig/BackgroundImage'
import BackgroundImageEditDialog from 'Event/template/NiftyFifty/Dashboard/Resources/Backgrounds/BackgroundsConfig/BackgroundImageEditDialog'
import Button from 'lib/ui/Button'

export default function BackgroundImageRow(props: {background: Background}) {
  const [visibleEditDialog, setVisibleEditDialog] = useState(false)
  const {background} = props
  const {zoomBackgrounds: templateSettings} = useNiftyFiftyTemplate()
  const {busy} = useBackgrounds()

  const toggleEditDialog = () => setVisibleEditDialog(!visibleEditDialog)

  return (
    <DraggableBox>
      <BackgroundImage
        alt="background"
        borderRadius={templateSettings.borderRadius}
        borderThickness={templateSettings.borderThickness}
        borderColor={templateSettings.borderColor}
        clickable={false}
        src={background.image.url}
        width="200"
        aria-label="background image"
      />
      <Button
        variant="contained"
        color="primary"
        disabled={busy}
        aria-label="edit"
        onClick={toggleEditDialog}
      >
        Edit
      </Button>
      <BackgroundImageEditDialog
        onClose={toggleEditDialog}
        isVisible={visibleEditDialog}
        background={background}
        onDone={toggleEditDialog}
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
