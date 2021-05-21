import React from 'react'
import styled from 'styled-components'
import Heading from 'Event/template/SimpleBlog/Dashboard/Sidebar/Heading'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddAgendaEventButton from 'Event/Dashboard/components/AgendaList/AddAgendaEventButton'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useVariables} from 'Event'
import Agenda from 'Event/Dashboard/components/AgendaList/AgendaItem'

import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import StyledText from 'lib/ui/typography/StyledText'

export const AGENDA_ITEM = 'Agenda Item'
export const AGENDA_LIST = 'Agenda List'

export type Agenda = Publishable & {
  startDate: string
  endDate: string | null
  text: string
  link: string | null
}

export default function AgendaList() {
  const {agenda, sidebar} = useTemplate()
  const isEdit = useEditMode()
  const v = useVariables()
  const hasAgenda = agenda.items.length > 0
  if (!hasAgenda && !isEdit) {
    return null
  }

  return (
    <Section>
      <EditComponent component={{type: AGENDA_LIST}}>
        <Heading aria-label="agendas">{v(agenda.title)}</Heading>
      </EditComponent>
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
  const {agenda} = useTemplate()

  return (
    <>
      {agenda.items.map((item: Agenda, index: number) => (
        <Agenda agenda={item} index={index} key={index} />
      ))}
    </>
  )
}

function useHandleDrag() {
  const updateTemplate = useUpdateTemplate()
  const {agenda: list} = useTemplate()

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

const StyledAddAgendaEventButton = styled(AddAgendaEventButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const Text = styled.p<{
  color: string
}>`
  color: ${(props) => props.color};
`
