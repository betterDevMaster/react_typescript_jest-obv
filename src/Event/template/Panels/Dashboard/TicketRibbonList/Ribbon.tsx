import {useAttendeeVariables} from 'Event'
import React from 'react'
import styled from 'styled-components'
import {HasRules} from 'Event/attendee-rules'
import {FontStyle} from 'lib/ui/typography/FontStyleInput'
import {useToggle} from 'lib/toggle'
import StyledText from 'lib/ui/typography/StyledText'
import {Draggable} from 'react-beautiful-dnd'
import TicketRibbonConfig from 'Event/template/Panels/Dashboard/TicketRibbonList/TicketRibbonConfig'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {CustomTicketRibbon} from 'organization/Event/DashboardConfig/TicketRibbonUpload'
import {DeepRequired} from 'lib/type-utils'

export type TicketRibbon = HasRules & {
  textColor: string
  backgroundColor: string
  letter: string
  letterUpload: CustomTicketRibbon | null
  hoverText: string
  hoverUpload: CustomTicketRibbon | null
  hoverTextFontStyles?: FontStyle[]
}

export const LETTER_WIDTH = 32

export default function Ribbon(props: {
  ticketRibbon: DeepRequired<TicketRibbon>
  index: number
  className?: string
}) {
  const {ticketRibbon, index} = props
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  const isEditMode = useEditMode()
  if (!isEditMode) {
    return <Body {...props} />
  }

  return (
    <>
      <TicketRibbonConfig
        isVisible={configVisible}
        ticketRibbon={ticketRibbon}
        index={index}
        onClose={toggleConfig}
      />
      <Draggable draggableId={String(index)} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={toggleConfig}
          >
            <Body {...props} />
          </div>
        )}
      </Draggable>
    </>
  )
}

function Body(props: {
  ticketRibbon: TicketRibbon
  index: number
  className?: string
}) {
  const {
    ticketRibbon: {
      textColor,
      letter,
      letterUpload,
      backgroundColor,
      hoverText,
      hoverTextFontStyles,
      hoverUpload,
    },
  } = props

  const v = useAttendeeVariables()

  const background = (upload?: CustomTicketRibbon | null) => {
    if (upload) {
      return `url("${upload.image.url}")`
    }

    return backgroundColor
  }

  const hasHoverImage = Boolean(hoverUpload)

  return (
    <Box aria-label="ticket ribbon" className={props.className}>
      <LetterBox color={textColor} background={background(letterUpload)}>
        <Letter aria-label="ticket ribbon letter">{v(letter)}</Letter>
      </LetterBox>
      <HoverBox color={textColor} background={backgroundColor}>
        <StyledText
          Component={HoverText}
          fontStyles={hoverTextFontStyles}
          color={textColor}
          hasImage={hasHoverImage}
        >
          {v(hoverText)}
        </StyledText>
        <HoverImage upload={hoverUpload} />
      </HoverBox>
    </Box>
  )
}

function HoverImage(props: {upload: CustomTicketRibbon | null}) {
  const {upload} = props

  if (!upload) {
    return null
  }

  return <img src={upload.image.url} alt="custom ribbon" />
}

const HoverBox = styled.div<{
  color: string
  background: string
}>`
  display: none;
  color: ${(props) => props.color};
  background: ${(props) => props.background};
  position: absolute;
  background-size: cover;
  left: 0;
  z-index: 2;
  height: 30px;
`

const Box = styled.div`
  position: relative;

  &:hover {
    ${HoverBox} {
      display: block;
    }
  }
`

const LetterBox = styled.div<{
  color: string
  background: string
}>`
  width: ${LETTER_WIDTH}px;
  height: 65px;
  color: ${(props) => props.color};
  background: ${(props) => props.background};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
`

const Letter = styled.span`
  font-size: 30px;
  text-align: center;
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  margin: 0;
  text-transform: uppercase;
`

const HoverText = styled.span<{hasImage: boolean}>`
  white-space: nowrap;
  position: ${(props) => (props.hasImage ? 'absolute' : 'relative')};
  font-size: 20px;
  padding: 0 10px;
  margin: 0;
`
