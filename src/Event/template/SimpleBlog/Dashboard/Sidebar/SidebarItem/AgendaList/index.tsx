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
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {AgendaListConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList/AgendaListConfig'
import {FontStyle} from 'lib/ui/typography/FontStyleInput'
import {uuid} from 'lib/uuid'
import {
  useRemoveSidebarItem,
  useUpdateSidebarItem,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'

export const AGENDA_LIST = 'Agenda List'
export type AgendaListProps = {
  id: string
  type: typeof AGENDA_LIST
  title: string
  description?: string
  footer?: string
  descriptionFontStyles?: FontStyle[]
  footerFontStyles?: FontStyle[]
  items: Agenda[]
}

export const createAgendaList = (): AgendaListProps => ({
  id: uuid(),
  type: AGENDA_LIST,
  title: 'Agenda',
  description: '',
  footer: 'Agenda Time is in YOUR time zone, not ours',
  items: [],
  footerFontStyles: [],
  descriptionFontStyles: [],
})

export type Agenda = Publishable & {
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
  const {template} = useSimpleBlog()
  const {sidebar} = template
  const isEdit = useEditMode()
  const v = useAttendeeVariables()
  const hasAgenda = items.length > 0
  const {flag: listConfigVisible, toggle: toggleListConfig} = useToggle()

  const removeItem = useRemoveSidebarItem(props)

  if (!hasAgenda && !isEdit) {
    return null
  }

  return (
    <>
      <AgendaListConfig
        list={props}
        isVisible={listConfigVisible}
        onClose={toggleListConfig}
      />
      <EditModeOnly>
        <RemoveButton size="large" showing onClick={removeItem}>
          Remove Agenda
        </RemoveButton>
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
      <DroppableList {...props} />
      <StyledText
        Component={Text}
        fontStyles={footerFontStyles}
        aria-label="agendas footer description"
        color={sidebar.textColor}
      >
        {v(footer || '')}
      </StyledText>
      <EditModeOnly>
        <StyledAddAgendaEventButton list={props} />
      </EditModeOnly>
    </>
  )
}

function DroppableList(props: AgendaListProps) {
  const handleDrag = useHandleDrag(props)
  const isEdit = useEditMode()

  if (!isEdit) {
    return <AgendaItemList {...props} />
  }

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
  return (
    <>
      {props.items.map((item: Agenda, index: number) => (
        <Agenda agenda={item} index={index} key={index} list={props} />
      ))}
    </>
  )
}

function useHandleDrag(props: AgendaListProps) {
  const {items} = props
  const updateSidebarItem = useUpdateSidebarItem()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(items)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateSidebarItem({
      ...props,
      items: moved,
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
