import AgendaList, {
  AGENDA_LIST,
  AgendaListProps,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/AgendaList'
import React, {useCallback} from 'react'
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
import {useCardsUpdate} from 'Event/template/Cards'
import TicketRibbons, {
  TicketRibbonListProps,
  TICKET_RIBBON_LIST,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList'
import Text, {
  TextProps,
  TEXT,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/Text'
import {Draggable} from 'react-beautiful-dnd'
import {DraggableOverlay} from 'lib/ui/drag-and-drop'
import DragHandleBar from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/DragHandleBar'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {REMOVE, useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
import {DeepPartialSubstitute} from 'lib/type-utils'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'

export type SidebarItemProps =
  | AgendaListProps
  | ResourceListProps
  | EmojiListProps
  | PointsSummaryProps
  | TicketRibbonListProps
  | SidebarNavProps
  | TextProps

type SidebarItemContextProps = {
  update: (data: DeepPartialSubstitute<SidebarItemProps, typeof REMOVE>) => void
  remove: () => void
}

const SidebarItemContext = React.createContext<
  SidebarItemContextProps | undefined
>(undefined)

export default function SidebarItem(
  props: SidebarItemProps & {id: string; index: number},
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

function Editable(props: SidebarItemProps & {id: string}) {
  const {id, ...itemProps} = props
  const updateTemplate = useCardsUpdate()

  const update = (
    updated: DeepPartialSubstitute<SidebarItemProps, typeof REMOVE>,
  ) => {
    updateTemplate({
      sidebarItems: {
        [id]: updated,
      },
    })
  }

  const remove = useCallback(() => {
    updateTemplate({
      sidebarItems: {
        [id]: REMOVE,
      },
    })
  }, [updateTemplate, id])

  useRemoveIfEmpty(remove, itemProps, {shouldSkip: !id})

  return (
    <SidebarItemContext.Provider value={{update, remove}}>
      <Item {...props} />
    </SidebarItemContext.Provider>
  )
}

function Item(props: SidebarItemProps) {
  switch (props.type) {
    case AGENDA_LIST:
      return (
        <VisibleOnMatch rules={props.rules}>
          <AgendaList {...props} />
        </VisibleOnMatch>
      )
    case RESOURCE_LIST:
      return (
        <VisibleOnMatch rules={props.rules}>
          <ResourceList {...props} />
        </VisibleOnMatch>
      )
    case EMOJI_LIST:
      return <EmojiList {...props} />
    case POINTS_SUMMARY:
      return (
        <VisibleOnMatch rules={props.rules}>
          <PointsSummary {...props} />
        </VisibleOnMatch>
      )
    case TICKET_RIBBON_LIST:
      return <TicketRibbons {...props} />
    case SIDEBAR_NAV:
      return <SidebarNav {...props} />
    case TEXT:
      return <Text {...props} />
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
