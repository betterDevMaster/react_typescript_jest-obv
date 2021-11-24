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
import {useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import TicketRibbons, {
  TicketRibbonListProps,
  TICKET_RIBBON_LIST,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList'
import {Draggable} from 'react-beautiful-dnd'
import {DraggableOverlay} from 'lib/ui/drag-and-drop'
import DragHandleBar from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/DragHandleBar'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {REMOVE} from 'Event/TemplateUpdateProvider'
import {DeepPartialSubstitute} from 'lib/type-utils'

export type SidebarItem =
  | AgendaListProps
  | ResourceListProps
  | EmojiListProps
  | PointsSummaryProps
  | TicketRibbonListProps
  | SidebarNavProps

type SidebarItemContextProps = {
  update: (data: DeepPartialSubstitute<SidebarItem, typeof REMOVE>) => void
  remove: () => void
}

const SidebarItemContext = React.createContext<
  SidebarItemContextProps | undefined
>(undefined)

export default function SidebarItem(
  props: SidebarItem & {id: string; index: number},
) {
  const isEditMode = useEditMode()
  if (!isEditMode) {
    return <Item {...props} />
  }

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <DraggableOverlay>
            <>
              <DragHandleBar handleProps={provided.dragHandleProps} />
              <Editable {...props} />
            </>
          </DraggableOverlay>
        </div>
      )}
    </Draggable>
  )
}

function Editable(props: SidebarItem & {id: string}) {
  const {id} = props
  const updateTemplate = useCardsUpdate()
  const {sidebarItems} = useCardsTemplate()

  const update = (
    updated: DeepPartialSubstitute<SidebarItem, typeof REMOVE>,
  ) => {
    updateTemplate({
      sidebarItems: {
        entities: {
          [id]: updated,
        },
      },
    })
  }

  const remove = () => {
    const removed = sidebarItems.ids.filter((i) => i !== id)

    updateTemplate({
      sidebarItems: {
        ids: removed,
        entities: {
          [id]: REMOVE,
        },
      },
    })
  }

  return (
    <SidebarItemContext.Provider value={{update, remove}}>
      <Item {...props} />
    </SidebarItemContext.Provider>
  )
}

function Item(props: SidebarItem) {
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

export function useEditSidebarItem() {
  const context = React.useContext(SidebarItemContext)
  if (context === undefined) {
    throw new Error(
      'useEditSidebarItem must be used within a Editable sidebar item',
    )
  }

  return context
}
