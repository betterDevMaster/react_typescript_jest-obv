import React, {useState} from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import {Sponsor} from 'Event/SponsorPage'
import Image from 'Event/template/Panels/Dashboard/Sponsors/SponsorList/Card/Image'
import Body from 'Event/template/Panels/Dashboard/Sponsors/SponsorList/Card/Body'
import {Draggable} from 'react-beautiful-dnd'
import SponsorForm from 'Event/template/Panels/Dashboard/Sponsors/SponsorList/Card/SponsorForm'
import NavButton from 'Event/Dashboard/components/NavButton'
import {usePanels} from 'Event/template/Panels'
import {rgba} from 'lib/color'
import QuestionIcon from 'Event/template/Panels/Dashboard/Sponsors/SponsorList/Card/QuestionIcon'
import {useSponsors} from 'organization/Event/SponsorsProvider'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'

export const SPONSOR_QUESTION_ICON_PLACEHOLDER = 'http://placehold.jp/50x50.png'

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

  const {
    template: {
      sponsors: {cardBackgroundColor, cardBackgroundOpacity},
    },
  } = usePanels()

  const backgroundColor = rgba(cardBackgroundColor, cardBackgroundOpacity / 100)

  return (
    <Box aria-label="sponsor" backgroundColor={backgroundColor}>
      <SponsorForm
        sponsor={sponsor}
        visible={formVisible}
        isEditMode={props.isEditMode}
        onClose={toggleForm}
      />
      <StyledEditable onEdit={() => edit(sponsor)} aria-label="edit sponsor">
        <StyledGrid container spacing={2}>
          <StyledImage sponsor={sponsor} isEditMode={props.isEditMode} />
          <Body sponsor={sponsor} />
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
    <Grid item xs={8}>
      {buttons.ids.map((id) => (
        <ButtonBox key={id}>
          <NavButton {...buttons.entities[id]} aria-label="sponsor button" />
        </ButtonBox>
      ))}
    </Grid>
  )
}

const StyledEditable = styled(Editable)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledGrid = styled(Grid)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10% 4%;
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

const StyledImage = styled(Image)`
  width: 100%;
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
