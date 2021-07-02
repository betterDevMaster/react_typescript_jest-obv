import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddAgendaButton from 'Event/template/SimpleBlog/Dashboard/AgendaList/AddAgendaButton'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useVariables} from 'Event'
import Agenda from 'Event/template/SimpleBlog/Dashboard/AgendaList/AgendaItem'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import StyledText from 'lib/ui/typography/StyledText'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {AgendaListConfig} from 'Event/template/SimpleBlog/Dashboard/AgendaList/AgendaListConfig'

export type Agenda = Publishable & {
  startDate: string
  endDate: string | null
  text: string
  link: string | null
}

export default function AgendaList() {
  const {template} = useSimpleBlog()
  const {agenda, sidebar} = template
  const isEdit = useEditMode()
  const v = useVariables()
  const hasAgenda = agenda.items.length > 0
  const {flag: listConfigVisible, toggle: toggleListConfig} = useToggle()

  if (!hasAgenda && !isEdit) {
    return null
  }

  return (
    <>
      <AgendaListConfig
        isVisible={listConfigVisible}
        onClose={toggleListConfig}
      />
      <Section>
        <Editable onEdit={toggleListConfig}>
          <Heading aria-label="agendas">{v(agenda.title)}</Heading>
        </Editable>
        <StyledText
          Component={Text}
          fontStyles={agenda.descriptionFontStyles}
          aria-label="agendas description"
          color={sidebar.textColor}
        >
          {v(agenda.description || '')}
        </StyledText>
        <DroppableList />
        <StyledText
          Component={Text}
          fontStyles={agenda.footerFontStyles}
          aria-label="agendas footer description"
          color={sidebar.textColor}
        >
          {v(agenda.footer || '')}
        </StyledText>
        <EditModeOnly>
          <StyledAddAgendaEventButton />
        </EditModeOnly>
      </Section>
    </>
  )
}

function DroppableList() {
  const handleDrag = useHandleDrag()
  const isEdit = useEditMode()

  if (!isEdit) {
    return <AgendaItemList />
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="drag-and-drop-agendas">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <>
              <AgendaItemList />
              {provided.placeholder}
            </>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function AgendaItemList() {
  const {template} = useSimpleBlog()
  const {agenda} = template

  return (
    <>
      {agenda.items.map((item: Agenda, index: number) => (
        <Agenda agenda={item} index={index} key={index} />
      ))}
    </>
  )
}

function useHandleDrag() {
  const updateTemplate = useDispatchUpdate()
  const {template} = useSimpleBlog()
  const {agenda: list} = template

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(list.items)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)
    updateTemplate({
      agenda: {
        ...list,
        items: moved,
      },
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
