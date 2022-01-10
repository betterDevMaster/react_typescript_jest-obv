import React, {useState} from 'react'
import {Draggable} from 'react-beautiful-dnd'
import styled from 'styled-components'

import {Grid, useTheme, useMediaQuery} from '@material-ui/core'

import {useAttendeeVariables} from 'Event'
import {Sponsor} from 'Event/SponsorPage'
import Image from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorList/Card/Image'
import SponsorForm from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorList/Card/SponsorForm'
import NavButton from 'Event/Dashboard/components/NavButton'
import QuestionIcon from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorList/Card/QuestionIcon'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {rgba} from 'lib/color'
import InnerContent from 'lib/ui/form/TextEditor/Content'
import ClearContent from 'lib/ui/layout/ClearContent'
import Clickable from 'lib/ui/Clickable'

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
          <Editable {...props} />
        </div>
      )}
    </Draggable>
  )
}

function Editable(props: SponsorProps) {
  const {edit} = useSponsors()

  return (
    <Clickable onClick={() => edit(props.sponsor)}>
      <Content {...props} />
    </Clickable>
  )
}

function Content(props: SponsorProps) {
  const {sponsor} = props
  const [formVisible, setFormVisible] = useState(false)
  const toggleForm = () => setFormVisible(!formVisible)
  const v = useAttendeeVariables()
  const theme = useTheme()
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'))
  const template = useNiftyFiftyTemplate()

  const backgroundColor =
    props.index % 2 === 0
      ? rgba(
          template.sponsors.evenBackgroundColor,
          template.sponsors.evenBackgroundOpacity,
        )
      : rgba(
          template.sponsors.oddBackgroundColor,
          template.sponsors.oddBackgroundOpacity,
        )

  return (
    <Box
      aria-label="sponsor"
      backgroundColor={backgroundColor}
      isXSMobile={isXSMobile}
    >
      <SponsorForm
        sponsor={sponsor}
        visible={formVisible}
        isEditMode={props.isEditMode}
        onClose={toggleForm}
      />
      <Grid item xs={template.sponsors.imageSize}>
        <StyledImage sponsor={sponsor} />
      </Grid>
      <HeadContent>
        <SponsorName color={template.textColor}>{v(sponsor.name)}</SponsorName>
        <QuestionIcon sponsor={sponsor} onClick={toggleForm} />
      </HeadContent>
      <InnerContent color={template.textColor}>
        {v(sponsor.description)}
      </InnerContent>
      <Buttons sponsor={props.sponsor} />
      <ClearContent />
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

const Box = styled((props) => {
  const {backgroundColor, isXSMobile, ...otherProps} = props
  return <div {...otherProps} />
})<{
  isXSMobile: boolean
  backgroundColor: string
}>`
  background: ${(props) => props.backgroundColor};
  padding: ${(props) =>
    props.isXSMobile ? props.theme.spacing[4] : props.theme.spacing[6]} 
    ${(props) =>
      props.isXSMobile ? props.theme.spacing[8] : props.theme.spacing[12]}};
  position: relative;
`

const HeadContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SponsorName = styled.div<{
  color: string
}>`
  line-height: 22px;
  font-weight: 700;
  font-size: 18px;
  color: ${(props) => props.color};
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 14px;
    line-height: 17px;
  }
`

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
