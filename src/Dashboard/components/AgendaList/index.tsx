import React from 'react'
import styled from 'styled-components'
import Heading from 'Dashboard/Template/SimpleBlog/Sidebar/Heading'
import moment from 'moment-timezone'
import EditComponent from 'Dashboard/edit/views/EditComponent'

export const AGENDA = 'Agenda'

export interface Agenda {
  startDate: string
  endDate?: string
  text: string
  link?: string
}

export default function AgendaList(props: {
  agendas: Agenda[]
  component?: React.FunctionComponent<any>
}) {
  const hasAgenda = props.agendas.length > 0
  if (!hasAgenda) {
    return null
  }

  const Component = props.component || 'div'

  return (
    <Component>
      <EditComponent type={AGENDA}>
        <>
          <Heading>AGENDA:</Heading>
          {props.agendas.map((agenda, index) => (
            <Agenda key={index} aria-label="agenda">
              <Times agenda={agenda} />
              <Item>{agenda.text}</Item>
            </Agenda>
          ))}
        </>
      </EditComponent>
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
      <TimeText>
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
      <TimeText>
        <strong>{`${getMonth(start)} ${getDay(start)}:`}</strong>{' '}
        {getTime(start)}
        {`- ${getTime(end)} ${tz}`}
      </TimeText>
    )
  }

  return (
    <TimeText>
      <strong>{`${getMonth(start)} ${getDay(start)}:`}</strong> {getTime(start)}
      {` - `}
      <strong>
        {getMonth(end)} {getDay(end)}:
      </strong>{' '}
      {getTime(end)} {tz}
    </TimeText>
  )
}

const Agenda = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const TimeText = styled.span`
  font-size: 14px;
  display: block;
  font-style: italic;
`

const Item = styled.span`
  font-size: 18px;
`
