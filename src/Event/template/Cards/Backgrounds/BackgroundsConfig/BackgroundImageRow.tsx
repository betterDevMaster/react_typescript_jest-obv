import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {useCards} from 'Event/template/Cards'
import {
  Background,
  useBackgrounds,
} from 'organization/Event/Backgrounds/BackgroundsProvider'
import BackgroundImage from 'Event/template/Cards/Backgrounds/BackgroundsConfig/BackgroundImage'
import BackgroundImageEditDialog from 'Event/template/Cards/Backgrounds/BackgroundsConfig/BackgroundImageEditDialog'

export default function BackgroundImageRow(props: {background: Background}) {
  const [visibleEditDialog, setVisibleEditDialog] = useState(false)
  const {background} = props
  const {
    template: {zoomBackgrounds: templateSettings},
  } = useCards()
  const {busy} = useBackgrounds()

  const toggleEditDialog = () => setVisibleEditDialog(!visibleEditDialog)

  return (
    <DraggableBox>
      <BackgroundImage
        alt="background"
        borderRadius={templateSettings?.borderRadius}
        borderThickness={templateSettings?.borderThickness}
        borderColor={templateSettings?.borderColor}
        clickable={false}
        src={background.image.url}
        width="200"
        aria-label="background image"
      />
      <Button
        type="button"
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
