import React from 'react'
import styled from 'styled-components'
import moment from 'moment-timezone'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import {useTemplate} from 'Event/TemplateProvider'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {useWithAttendeeData} from 'Event/auth/attendee-data'
import {useVariables} from 'Event'
import {Agenda, AGENDA_ITEM} from 'Event/Dashboard/components/AgendaList/'
import {Draggable} from 'react-beautiful-dnd'
import {DragHandle, DraggableOverlay} from 'lib/ui/drag-and-drop'

export default function AgendaItem(props: {agenda: Agenda; index: number}) {
  const {agenda, index} = props
  const isEdit = useEditMode()

  if (!isEdit) {
    return (
      <Published component={agenda}>
        <Box aria-label="agenda">
          <Event agenda={agenda} />
          <Times agenda={agenda} />
        </Box>
      </Published>
    )
  }

  return (
    <Draggable draggableId={`drag-and-drop-agenda-${index}`} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <DraggableOverlay>
            <EditComponent
              component={{type: AGENDA_ITEM, id: index}}
              key={index}
            >
              <>
                <DragHandle handleProps={provided.dragHandleProps} />
                <Published component={agenda}>
                  <Box aria-label="agenda">
                    <Event agenda={agenda} />
                    <Times agenda={agenda} />
                  </Box>
                </Published>
              </>
            </EditComponent>
          </DraggableOverlay>
        </div>
      )}
    </Draggable>
  )
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

function Times(props: {agenda: Agenda}) {
  const start = moment(props.agenda.startDate)
  const getMonth = (date: moment.Moment) => date.format('MMMM')
  const getDay = (date: moment.Moment) => date.format('Do')
  const getTime = (date: moment.Moment) => date.format('h:mma')
  const getTimezone = (date: moment.Moment) =>
    date.tz(moment.tz.guess()).format('z')
  const {sidebar} = useTemplate()
  const sidebarTextColor = sidebar.textColor

  const tz = getTimezone(start)

  /**
   * Single start date only
   */
  if (
    !props.agenda.endDate ||
    props.agenda.startDate === props.agenda.endDate
  ) {
    return (
      <TimeText aria-label="agenda event times" color={sidebarTextColor}>
        <strong>{`${getMonth(start)} ${getDay(start)}:`}</strong>{' '}
        {`${getTime(start)} ${tz}`}
      </TimeText>
    )
  }

  /**
   * Start, and end same day, different times
   */
  const end = moment(props.agenda.endDate)
  const sameMonth = getMonth(end) === getMonth(start)
  const sameDay = getDay(end) === getDay(start)
  if (sameMonth && sameDay) {
    return (
      <TimeText aria-label="agenda event times" color={sidebarTextColor}>
        <strong>{`${getMonth(start)} ${getDay(start)}:`}</strong>{' '}
        {getTime(start)}
        {` - ${getTime(end)} ${tz}`}
      </TimeText>
    )
  }

  /**
   * Two different date/times
   */
  return (
    <TimeText aria-label="agenda event times" color={sidebarTextColor}>
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
  const withAttendeeData = useWithAttendeeData()
  const v = useVariables()

  if (props.agenda.link) {
    return (
      <StyledAbsoluteLink
        newTab
        to={withAttendeeData(props.agenda.link)}
        color={sidebar.textColor}
      >
        <EventText aria-label="agenda event" color={sidebar.textColor}>
          {v(props.agenda.text)}
        </EventText>
      </StyledAbsoluteLink>
    )
  }

  return (
    <EventText aria-label="agenda event" color={sidebar.textColor}>
      {v(props.agenda.text)}
    </EventText>
  )
}

const TimeText = styled.span<{color: string}>`
  font-size: 14px;
  color: ${(props) => props.color};
`

const EventText = styled.span<{color: string}>`
  font-size: 18px;
  display: block;
  font-style: italic;
  color: ${(props) => props.color};
`
const StyledAbsoluteLink = styled(AbsoluteLink)<{color: string}>`
  color: ${(props) => props.color};
`
