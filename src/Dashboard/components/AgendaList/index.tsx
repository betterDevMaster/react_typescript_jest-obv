import React from 'react'
import styled from 'styled-components'
import Heading from 'Dashboard/Template/SimpleBlog/Sidebar/Heading'
import moment from 'moment-timezone'
import EditComponent from 'Dashboard/edit/views/EditComponent'
import {useCurrent} from 'Dashboard/edit/state/edit-mode'
import EditModeOnly from 'Dashboard/edit/views/EditModeOnly'
import AddAgendaEventButton from 'Dashboard/components/AgendaList/AddAgendaEventButton'

export const AGENDA = 'Agenda'

export interface Agenda {
  startDate: string
  endDate: string | null
  text: string
  link: string | null
}

export default function AgendaList(props: {
  agendas: Agenda[]
  container?: React.FunctionComponent<any>
}) {
  const agendas = useCurrent(
    (state) => state.dashboardEditor.agendas,
    props.agendas,
  )

  const hasAgenda = agendas.length > 0
  if (!hasAgenda) {
    return (
      <EditModeOnly>
        <StyledAddAgendaEventButton />
      </EditModeOnly>
    )
  }

  const Component = props.container || 'div'

  return (
    <Component>
      <Heading>AGENDA:</Heading>
      {agendas.map((agenda, index) => (
        <EditComponent type={AGENDA} id={index} key={index}>
          <Agenda aria-label="agenda">
            <Times agenda={agenda} />
            <Event agenda={agenda} />
          </Agenda>
        </EditComponent>
      ))}
      <StyledAddAgendaEventButton />
    </Component>
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
        {`- ${getTime(end)} ${tz}`}
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
  if (props.agenda.link) {
    return (
      <a href={props.agenda.link} target="_blank" rel="noopener noreferrer">
        <EventText aria-label="agenda event">{props.agenda.text}</EventText>
      </a>
    )
  }

  return <EventText aria-label="agenda event">{props.agenda.text}</EventText>
}

const Agenda = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const TimeText = styled.span`
  font-size: 14px;
  display: block;
  font-style: italic;
`

const EventText = styled.span`
  font-size: 18px;
`

const StyledAddAgendaEventButton = styled(AddAgendaEventButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
