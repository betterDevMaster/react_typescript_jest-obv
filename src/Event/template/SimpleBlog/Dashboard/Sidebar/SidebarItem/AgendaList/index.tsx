import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddAgendaButton from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList/AddAgendaButton'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useAttendeeVariables} from 'Event'
import Agenda from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList/AgendaItem'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import StyledText from 'lib/ui/typography/StyledText'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {AgendaListConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList/AgendaListConfig'
import {FontStyle} from 'lib/ui/typography/FontStyleInput'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {createPositions, HashMap, Ordered, orderedIdsByPosition} from 'lib/list'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
import {HasRules} from 'Event/attendee-rules'

export const AGENDA_LIST = 'Agenda List'
export type AgendaListProps = Ordered &
  HasRules & {
    type: typeof AGENDA_LIST
    title: string
    description?: string
    footer?: string
    descriptionFontStyles?: FontStyle[]
    footerFontStyles?: FontStyle[]
    items: HashMap<AgendaSettings>
  }

export const createAgendaList = (): AgendaListProps => ({
  type: AGENDA_LIST,
  title: 'Agenda',
  description: '',
  footer: 'Agenda Time is in YOUR time zone, not ours',
  items: {},
  footerFontStyles: [],
  descriptionFontStyles: [],
})

export type AgendaSettings = Publishable &
  Ordered & {
    startDate: string
    endDate: string | null
    text: string
    link: string | null
  }

export default function AgendaList(props: AgendaListProps) {
  const {
    title,
    items,
    descriptionFontStyles,
    footer,
    description,
    footerFontStyles,
  } = props
  const template = useSimpleBlogTemplate()
  const {sidebar} = template
  const isEdit = useEditMode()
  const v = useAttendeeVariables()
  const hasAgenda = Object.keys(items).length > 0
  const {flag: listConfigVisible, toggle: toggleListConfig} = useToggle()

  if (!hasAgenda && !isEdit) {
    return null
  }

  return (
    <Section>
      <EditModeOnly>
        <AgendaListConfig
          list={props}
          isVisible={listConfigVisible}
          onClose={toggleListConfig}
        />
        <RemoveAgendaListButton {...props} />
      </EditModeOnly>
      <Editable onEdit={toggleListConfig}>
        <Heading aria-label="agendas">{v(title)}</Heading>
      </Editable>
      <StyledText
        Component={Text}
        fontStyles={descriptionFontStyles}
        aria-label="agendas description"
        color={sidebar.textColor}
      >
        {v(description || '')}
      </StyledText>
      <AgendaListContent {...props} />
      <StyledText
        Component={Text}
        fontStyles={footerFontStyles}
        aria-label="agendas footer description"
        color={sidebar.textColor}
      >
        {v(footer || '')}
      </StyledText>
      <EditModeOnly>
        <StyledAddAgendaEventButton />
      </EditModeOnly>
    </Section>
  )
}

function RemoveAgendaListButton(props: AgendaListProps) {
  const {remove: removeItem} = useEditSidebarItem()
  useRemoveIfEmpty(removeItem, props)

  return (
    <RemoveButton size="large" showing onClick={removeItem}>
      Remove Agenda
    </RemoveButton>
  )
}

function AgendaListContent(props: AgendaListProps) {
  const isEdit = useEditMode()
  if (!isEdit) {
    return <AgendaItemList {...props} />
  }
  return <DraggableList {...props} />
}

function DraggableList(props: AgendaListProps) {
  const handleDrag = useHandleDrag(props)

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="drag-and-drop-agendas">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <>
              <AgendaItemList {...props} />
              {provided.placeholder}
            </>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function AgendaItemList(props: AgendaListProps) {
  const ids = orderedIdsByPosition(props.items)
  return (
    <>
      {ids.map((id, index) => {
        const agenda = props.items[id]
        return <Agenda agenda={agenda} id={id} key={id} index={index} />
      })}
    </>
  )
}

function useHandleDrag(props: AgendaListProps) {
  const {items} = props
  const {update} = useEditSidebarItem()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const ids = orderedIdsByPosition(items)
    const [removed] = ids.splice(source.index, 1)
    ids.splice(destination.index, 0, removed)

    update({
      items: createPositions(ids),
    })
  }
}

const StyledAddAgendaEventButton = styled(AddAgendaButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const Text = styled.p<{
  color: string
}>`
  color: ${(props) => props.color};
`
