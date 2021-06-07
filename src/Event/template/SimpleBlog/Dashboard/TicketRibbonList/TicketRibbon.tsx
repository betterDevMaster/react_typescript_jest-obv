import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'
import styled from 'styled-components'
import BLACK_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/black.png'
import BLUE_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/blue.png'
import BROWN_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/brown.png'
import GREEN_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/green.png'
import GREY_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/grey.png'
import ORANGE_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/orange.png'
import PURPLE_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/purple.png'
import RED_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/red.png'
import WHITE_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/white.png'
import YELLOW_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/yellow.png'
import DARK_BLUE_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/dark_blue.png'
import DARK_TEAL_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/dark_teal.png'
import PURPLISH_BLUE_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/purplish_blue.png'
import TEAL_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/teal.png'
import MAGENTA_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/magenta.png'
import LIGHT_BLUE_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/light_blue.png'
import LIGHT_PURPLE_RIBBON_IMAGE from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/ribbons/light_purple.png'
import {HasRules} from 'Event/visibility-rules'
import {useVariables} from 'Event'
import Typography from '@material-ui/core/Typography'
import {FileLocation} from 'lib/http-client'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {Draggable} from 'react-beautiful-dnd'
import {DragHandle, DraggableOverlay} from 'lib/ui/drag-and-drop'

export const TICKET_RIBBON = 'Ticket Ribbon'

export const BLACK_RIBBON = 'Black'
export const BLUE_RIBBON = 'Blue'
export const LIGHT_BLUE_RIBBON = 'Light Blue'
export const DARK_BLUE_RIBBON = 'Dark Blue'
export const TEAL_RIBBON = 'Teal'
export const DARK_TEAL_RIBBON = 'Dark Teal'
export const BROWN_RIBBON = 'Brown'
export const GREEN_RIBBON = 'Green'
export const GREY_RIBBON = 'Grey'
export const ORANGE_RIBBON = 'Orange'
export const PURPLE_RIBBON = 'Purple'
export const LIGHT_PURPLE_RIBBON = 'Light Purple'
export const PURPLISH_BLUE_RIBBON = 'Purplish Blue'
export const RED_RIBBON = 'Red'
export const MAGENTA_RIBBON = 'Magenta'
export const WHITE_RIBBON = 'White'
export const YELLOW_RIBBON = 'Yellow'
export const CUSTOM_RIBBON = 'Custom'

export type TicketRibbonName =
  | typeof BLACK_RIBBON
  | typeof BLUE_RIBBON
  | typeof LIGHT_BLUE_RIBBON
  | typeof DARK_BLUE_RIBBON
  | typeof TEAL_RIBBON
  | typeof DARK_TEAL_RIBBON
  | typeof BROWN_RIBBON
  | typeof GREEN_RIBBON
  | typeof GREY_RIBBON
  | typeof ORANGE_RIBBON
  | typeof PURPLE_RIBBON
  | typeof LIGHT_PURPLE_RIBBON
  | typeof PURPLISH_BLUE_RIBBON
  | typeof RED_RIBBON
  | typeof MAGENTA_RIBBON
  | typeof WHITE_RIBBON
  | typeof YELLOW_RIBBON
  | typeof CUSTOM_RIBBON

export type TicketRibbon = HasRules & {
  name: TicketRibbonName
  text: string
  color: string
  customRibbon?: CustomTicketRibbon | null
}

export type CustomTicketRibbon = {
  id: number
  image: FileLocation
}

export const TICKET_RIBBON_IMAGE: Record<string, string> = {
  [BLACK_RIBBON]: BLACK_RIBBON_IMAGE,
  [LIGHT_BLUE_RIBBON]: LIGHT_BLUE_RIBBON_IMAGE,
  [BLUE_RIBBON]: BLUE_RIBBON_IMAGE,
  [DARK_BLUE_RIBBON]: DARK_BLUE_RIBBON_IMAGE,
  [TEAL_RIBBON]: TEAL_RIBBON_IMAGE,
  [DARK_TEAL_RIBBON]: DARK_TEAL_RIBBON_IMAGE,
  [BROWN_RIBBON]: BROWN_RIBBON_IMAGE,
  [GREEN_RIBBON]: GREEN_RIBBON_IMAGE,
  [GREY_RIBBON]: GREY_RIBBON_IMAGE,
  [ORANGE_RIBBON]: ORANGE_RIBBON_IMAGE,
  [LIGHT_PURPLE_RIBBON]: LIGHT_PURPLE_RIBBON_IMAGE,
  [PURPLE_RIBBON]: PURPLE_RIBBON_IMAGE,
  [PURPLISH_BLUE_RIBBON]: PURPLISH_BLUE_RIBBON_IMAGE,
  [RED_RIBBON]: RED_RIBBON_IMAGE,
  [MAGENTA_RIBBON]: MAGENTA_RIBBON_IMAGE,
  [WHITE_RIBBON]: WHITE_RIBBON_IMAGE,
  [YELLOW_RIBBON]: YELLOW_RIBBON_IMAGE,
}

export const RIBBONS = Object.keys(TICKET_RIBBON_IMAGE) as TicketRibbonName[]
export const IMAGES = Object.values(TICKET_RIBBON_IMAGE)

export default function TicketRibbon(props: {
  ticketRibbon: TicketRibbon
  index: number
}) {
  const isEdit = useEditMode()

  if (!isEdit) {
    return <TicketRibbonItem {...props} />
  }

  return (
    <Draggable draggableId={String(props.index)} index={props.index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <DraggableOverlay>
            <EditComponent
              component={{type: TICKET_RIBBON, index: props.index}}
            >
              <>
                <DragHandle handleProps={provided.dragHandleProps} />
                <TicketRibbonItem {...props} />
              </>
            </EditComponent>
          </DraggableOverlay>
        </div>
      )}
    </Draggable>
  )
}

function TicketRibbonItem(props: {ticketRibbon: TicketRibbon; index: number}) {
  const {ticketRibbon} = props
  const image =
    ticketRibbon.customRibbon?.image.url ||
    TICKET_RIBBON_IMAGE[props.ticketRibbon.name]
  const v = useVariables()

  return (
    <Box aria-label="ticket ribbon">
      <Background src={image} aria-label="ticket ribbon image" />
      <TextBox color={props.ticketRibbon.color}>
        <Text aria-label="ticket ribbon text" align="center" variant="h3">
          {v(props.ticketRibbon.text)}
        </Text>
      </TextBox>
    </Box>
  )
}

const Box = styled.div`
  position: relative;
  margin: ${(props) => `0 0 ${props.theme.spacing[8]}`};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    margin: ${(props) =>
      `0 -${props.theme.spacing[13]} ${props.theme.spacing[8]}`};
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    margin: ${(props) =>
      `0 -${props.theme.spacing[16]} ${props.theme.spacing[8]}`};
  }
`

const TextBox = styled.div<{
  color: string
}>`
  width: 100%;
  height: 100%;
  color: ${(props) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
`

const Text = styled(Typography)`
  word-wrap: break-word;
`

const Background = styled.img`
  width: 100%;
`
