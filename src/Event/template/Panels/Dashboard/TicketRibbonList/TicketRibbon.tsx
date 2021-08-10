import {useVariables} from 'Event'
import React from 'react'
import styled from 'styled-components'
import {HasRules} from 'Event/visibility-rules'
import {FontStyle} from 'lib/ui/typography/FontStyleInput'
import {useToggle} from 'lib/toggle'
import StyledText from 'lib/ui/typography/StyledText'
import {Draggable} from 'react-beautiful-dnd'
import TicketRibbonConfig from 'Event/template/Panels/Dashboard/TicketRibbonList/TicketRibbonConfig'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {CustomTicketRibbon} from 'organization/Event/DashboardConfig/TicketRibbonUpload'

export type TicketRibbon = HasRules & {
  textColor: string
  backgroundColor: string
  letter: string
  letterUpload: CustomTicketRibbon | null
  hoverText: string
  hoverUpload: CustomTicketRibbon | null
  hoverTextFontStyles?: FontStyle[] | undefined
}

export const HOVER_IMAGE_WIDTH = 106
export const LETTER_WIDTH = 32

export default function TicketRibbon(props: {
  ticketRibbon: TicketRibbon
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
      hoverUpload,
      hoverText,
      hoverTextFontStyles,
    },
  } = props

  const v = useVariables()

  const hoverBoxWidth = hoverUpload ? `${HOVER_IMAGE_WIDTH}px` : 'auto'

  const background = (upload?: CustomTicketRibbon | null) => {
    if (upload) {
      return `url("${upload.image.url}")`
    }

    return backgroundColor
  }

  return (
    <Box aria-label="ticket ribbon" className={props.className}>
      <LetterBox color={textColor} background={background(letterUpload)}>
        <Letter aria-label="ticket ribbon letter">{v(letter)}</Letter>
      </LetterBox>
      <HoverBox
        color={textColor}
        background={background(hoverUpload)}
        width={hoverBoxWidth}
      >
        <StyledText
          Component={HoverText}
          fontStyles={hoverTextFontStyles}
          color={textColor}
        >
          {v(hoverText)}
        </StyledText>
      </HoverBox>
    </Box>
  )
}

const HoverBox = styled.div<{
  color: string
  background: string
  width: string
}>`
  display: none;
  color: ${(props) => props.color};
  background: ${(props) => props.background};
  position: absolute;
  background-size: cover;
  left: 0;
  z-index: 2;
  height: 30px;
  width: ${(props) => props.width};
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
  word-wrap: break-word;
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  margin: 0;
  text-transform: uppercase;
`

const HoverText = styled.span`
  word-wrap: break-word;
  font-size: 20px;
  padding: 0 10px;
  margin: 0;
`
