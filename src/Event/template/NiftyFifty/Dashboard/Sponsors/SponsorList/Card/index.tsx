import React, {useState} from 'react'
import {Draggable} from 'react-beautiful-dnd'
import styled from 'styled-components'

import Grid from '@material-ui/core/Grid'

import {useAttendeeVariables} from 'Event'
import {Sponsor} from 'Event/SponsorPage'
import Image from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorList/Card/Image'
import SponsorForm from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorList/Card/SponsorForm'
import NavButton from 'Event/Dashboard/components/NavButton'
import QuestionIcon from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorList/Card/QuestionIcon'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {rgba} from 'lib/color'
import TextContent from 'lib/ui/form/TextEditor/Content'

import {useSponsors} from 'organization/Event/SponsorsProvider'

export const SPONSOR_QUESTION_ICON_PLACEHOLDER = 'http://placehold.jp/50x50.png'

/**
 * Button width is fixed for all buttons. This sets the width relative
 * to the current size of the sponsor card.
 */
const BUTTONS_WIDTH_PERCENT = 75

type SponsorProps = {
  index: number
  sponsor: Sponsor
  isEditMode?: boolean
  className?: string
}

export default function Card(props: SponsorProps) {
  const {sponsor, isEditMode, index} = props

  if (!isEditMode) {
    return <Content {...props} />
  }

  return (
    <Draggable draggableId={String(sponsor.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className={props.className}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Content {...props} />
        </div>
      )}
    </Draggable>
  )
}

function Content(props: SponsorProps) {
  const {sponsor} = props
  const [formVisible, setFormVisible] = useState(false)
  const toggleForm = () => setFormVisible(!formVisible)
  const {edit} = useSponsors()
  const v = useAttendeeVariables()

  const template = useNiftyFiftyTemplate()

  const backgroundColor = rgba(
    template.sponsors.cardBackgroundColor,
    template.sponsors.cardBackgroundOpacity / 100,
  )

  return (
    <Box aria-label="sponsor" backgroundColor={backgroundColor}>
      <SponsorForm
        sponsor={sponsor}
        visible={formVisible}
        isEditMode={props.isEditMode}
        onClose={toggleForm}
      />
      <StyledEditable onEdit={() => edit(sponsor)} aria-label="edit sponsor">
        <StyledGrid>
          <Left item xs={template.sponsors.imageSize}>
            <StyledImage sponsor={sponsor} isEditMode={props.isEditMode} />
          </Left>
          <TextContent color={template.textColor}>
            {v(sponsor.description)}
          </TextContent>
          <Buttons sponsor={props.sponsor} />
          <StyledQuestionIcon sponsor={sponsor} onClick={toggleForm} />
        </StyledGrid>
      </StyledEditable>
    </Box>
  )
}

function Buttons(props: {sponsor: Sponsor}) {
  const buttons = props.sponsor.settings?.buttons

  if (!buttons || buttons.ids.length === 0) {
    return null
  }

  return (
    <ButtonsContainer>
      {buttons.ids.map((id) => (
        <ButtonBox key={id}>
          <NavButton {...buttons.entities[id]} aria-label="sponsor button" />
        </ButtonBox>
      ))}
    </ButtonsContainer>
  )
}

const StyledEditable = styled(Editable)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledGrid = styled.div`
  position: relative;
  padding: ${(props) => props.theme.spacing[4]};
  height: 100%;
`

const Box = styled((props) => {
  const {backgroundColor, ...otherProps} = props
  return <div {...otherProps} />
})<{backgroundColor: string}>`
  height: 100%;
  background: ${(props) => props.backgroundColor};
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;

  > div {
    flex: 1;
  }
`

const Left = styled(Grid)``

const StyledImage = styled(Image)`
  float: left;
  margin: ${(props) =>
    `${props.theme.spacing[5]} ${props.theme.spacing[4]} ${props.theme.spacing[4]} 0`};
`

const ButtonsContainer = styled.div`
  margin: auto;
  width: ${BUTTONS_WIDTH_PERCENT}%;
`

const ButtonBox = styled.div`
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
`

const StyledQuestionIcon = styled(QuestionIcon)`
  position: absolute;
  right: 16px;
  bottom: 8px;
`
