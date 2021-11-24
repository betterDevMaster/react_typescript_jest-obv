import React from 'react'
import styled from 'styled-components'
import moment from 'moment-timezone'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {useWithAttendeeData} from 'Event/auth/attendee-data'
import {useAttendeeVariables} from 'Event'
import {
  Agenda,
  AgendaListProps,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList'
import {Draggable} from 'react-beautiful-dnd'
import {DragHandle, DraggableOverlay} from 'lib/ui/drag-and-drop'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {AgendaItemConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList/AgendaItemConfig'
import {useLocalization} from 'lib/LocalizationProvider'

export default function AgendaItem(props: {
  agenda: Agenda
  list: AgendaListProps
  id: string
  index: number
}) {
  const {agenda, id, list, index} = props
  const isEditMode = useEditMode()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  if (!isEditMode) {
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
    <>
      <AgendaItemConfig
        list={list}
        isVisible={configVisible}
        onClose={toggleConfig}
        agenda={agenda}
        id={id}
      />
      <Draggable draggableId={`drag-and-drop-agenda-${index}`} index={index}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <DraggableOverlay>
              <Editable onEdit={toggleConfig} key={index}>
                <>
                  <DragHandle handleProps={provided.dragHandleProps} />
                  <Published component={agenda}>
                    <Box aria-label="agenda">
                      <Event agenda={agenda} />
                      <Times agenda={agenda} />
                    </Box>
                  </Published>
                </>
              </Editable>
            </DraggableOverlay>
          </div>
        )}
      </Draggable>
    </>
  )
}

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

function Times(props: {agenda: Agenda}) {
  const start = moment(props.agenda.startDate)
  const getMonth = (date: moment.Moment) => date.format('MMMM')
  const getDay = (date: moment.Moment) => date.format('Do')

  const {has12HourTime} = useLocalization()
  const timeFormat = has12HourTime ? 'h:mma' : 'HH:mm'
  const getTime = (date: moment.Moment) => date.format(timeFormat)

  const getTimezone = (date: moment.Moment) =>
    date.tz(moment.tz.guess()).format('z')
  const template = useSimpleBlogTemplate()
  const {sidebar} = template
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
  const template = useSimpleBlogTemplate()
  const {sidebar} = template
  const withAttendeeData = useWithAttendeeData()
  const v = useAttendeeVariables()

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
