import AgendaList, {
  AGENDA_LIST,
  AgendaListProps,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/AgendaList'
import React from 'react'
import EmojiList, {
  EMOJI_LIST,
  EmojiListProps,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/EmojiList'
import PointsSummary, {
  PointsSummaryProps,
  POINTS_SUMMARY,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/PointsSummary'
import {
  RESOURCE_LIST,
  ResourceListProps,
  ResourceList,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/ResourceList'
import SidebarNav, {
  SidebarNavProps,
  SIDEBAR_NAV,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/SidebarNav'
import {useCards} from 'Event/template/Cards'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import TicketRibbons, {
  TicketRibbonListProps,
  TICKET_RIBBON_LIST,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList'
import {Draggable} from 'react-beautiful-dnd'
import {DraggableOverlay} from 'lib/ui/drag-and-drop'
import DragHandleBar from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/DragHandleBar'
import Section from 'Event/template/Cards/Dashboard/Sidebar/Section'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export type SidebarItem =
  | AgendaListProps
  | ResourceListProps
  | EmojiListProps
  | PointsSummaryProps
  | TicketRibbonListProps
  | SidebarNavProps

export default function SidebarItem(props: SidebarItem & {index: number}) {
  const isEditMode = useEditMode()
  const isFirst = props.index === 0

  if (!isEditMode) {
    return <Body {...props} />
  }

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <Section
          ref={provided.innerRef}
          draggableProps={provided.draggableProps}
          disableBorder={isFirst}
        >
          <DraggableOverlay>
            <>
              <DragHandleBar handleProps={provided.dragHandleProps} />
              <Body {...props} />
            </>
          </DraggableOverlay>
        </Section>
      )}
    </Draggable>
  )
}

function Body(props: SidebarItem) {
  switch (props.type) {
    case AGENDA_LIST:
      return <AgendaList {...props} />
    case RESOURCE_LIST:
      return <ResourceList {...props} />
    case EMOJI_LIST:
      return <EmojiList {...props} />
    case POINTS_SUMMARY:
      return <PointsSummary {...props} />
    case TICKET_RIBBON_LIST:
      return <TicketRibbons {...props} />
    case SIDEBAR_NAV:
      return <SidebarNav {...props} />
  }
}

export function useUpdateSidebarItem() {
  const update = useDispatchUpdate()
  const {template} = useCards()

  return (item: SidebarItem) => {
    const updated = template.sidebarItems.map((i) => {
      const isTarget = i.id === item.id
      if (isTarget) {
        return item
      }

      return i
    })

    update({
      sidebarItems: updated,
    })
  }
}

export function useRemoveSidebarItem(item: SidebarItem) {
  const update = useDispatchUpdate()
  const {template} = useCards()

  return () => {
    const removed = template.sidebarItems.filter((i) => i.id !== item.id)

    update({
      sidebarItems: removed,
    })
  }
}
