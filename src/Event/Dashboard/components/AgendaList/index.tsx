import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import moment from 'moment-timezone'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import Published, {Publishable} from 'Event/Dashboard/editor/views/Published'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddAgendaEventButton from 'Event/Dashboard/components/AgendaList/AddAgendaEventButton'
import {useTemplate} from 'Event/TemplateProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'

export const AGENDA_ITEM = 'Agenda Item'
export const AGENDA_LIST = 'Agenda List'

export type Agenda = Publishable & {
  startDate: string
  endDate: string | null
  text: string
  link: string | null
}

export default function AgendaList() {
  const {agenda} = useTemplate()
  const isEdit = useEditMode()

  const hasAgenda = agenda.items.length > 0
  if (!hasAgenda && !isEdit) {
    return null
  }

  return (
    <Section>
      <EditComponent component={{type: AGENDA_LIST}}>
        <Heading aria-label="agendas">{agenda.title}</Heading>
      </EditComponent>
      <>
        {agenda.items.map((item, index) => (
          <EditComponent component={{type: AGENDA_ITEM, id: index}} key={index}>
            <Published component={item}>
              <Agenda aria-label="agenda">
                <Event agenda={item} />
                <Times agenda={item} />
              </Agenda>
            </Published>
          </EditComponent>
        ))}
      </>
      <EditModeOnly>
        <StyledAddAgendaEventButton />
      </EditModeOnly>
    </Section>
  )
}

function Times(props: {agenda: Agenda}) {
  const start = moment(props.agenda.startDate)

  const getMonth = (date: moment.Moment) => date.format('MMMM')
  const getDay = (date: moment.Moment) => date.format('Do')
  const getTime = (date: moment.Moment) => date.format('h:mma')
  const getTimezone = (date: moment.Moment) =>
    date.tz(moment.tz.guess()).format('z')

  const tz = getTimezone(start)

  if (!props.agenda.endDate) {
    return (
      <TimeText aria-label="agenda event times">
        <strong>{`${getMonth(start)} ${getDay(start)}:`}</strong>{' '}
        {`${getTime(start)} ${tz}`}
      </TimeText>
    )
  }

  const end = moment(props.agenda.endDate)
  const sameMonth = getMonth(end) === getMonth(start)
  const sameDay = getDay(end) === getDay(start)
  if (sameMonth && sameDay) {
    return (
      <TimeText aria-label="agenda event times">
        <strong>{`${getMonth(start)} ${getDay(start)}:`}</strong>{' '}
        {getTime(start)}
        {` - ${getTime(end)} ${tz}`}
      </TimeText>
    )
  }

  return (
    <TimeText aria-label="agenda event times">
      <strong>{`${getMonth(start)} ${getDay(start)}:`}</strong> {getTime(start)}
      {` - `}
      <strong>
        {getMonth(end)} {getDay(end)}:
      </strong>{' '}
      {getTime(end)} {tz}
    </TimeText>
  )
}

function Event(props: {agenda: Agenda}) {
  const {sidebar} = useTemplate()

  if (props.agenda.link) {
    return (
      <StyledAbsoluteLink
        newTab
        to={props.agenda.link}
        color={sidebar.textColor}
      >
        <EventText aria-label="agenda event" color={sidebar.textColor}>
          {props.agenda.text}
        </EventText>
      </StyledAbsoluteLink>
    )
  }

  return (
    <EventText aria-label="agenda event" color={sidebar.textColor}>
      {props.agenda.text}
    </EventText>
  )
}

const Agenda = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const TimeText = styled.span`
  font-size: 14px;
`

const EventText = styled.span<{color: string}>`
  font-size: 18px;
  display: block;
  font-style: italic;
  color: ${(props) => props.color};
`

const StyledAddAgendaEventButton = styled(AddAgendaEventButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const StyledAbsoluteLink = styled(AbsoluteLink)<{color: string}>`
  color: ${(props) => props.color};
`
