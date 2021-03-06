import AgendaList, {
  AGENDA_LIST,
  AgendaListProps,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList'
import React, {useCallback} from 'react'
import EmojiList, {
  EMOJI_LIST,
  EmojiListProps,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/EmojiList'
import PointsSummary, {
  PointsSummaryProps,
  POINTS_SUMMARY,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/PointsSummary'
import {
  RESOURCE_LIST,
  ResourceListProps,
  ResourceList,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/ResourceList'
import SidebarNav, {
  SidebarNavProps,
  SIDEBAR_NAV,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/SidebarNav'
import {useSimpleBlogUpdate} from 'Event/template/SimpleBlog'
import TicketRibbons, {
  TicketRibbonListProps,
  TICKET_RIBBON_LIST,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList'
import Text, {
  TextProps,
  TEXT,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/Text'
import {Draggable} from 'react-beautiful-dnd'
import {DraggableOverlay} from 'lib/ui/drag-and-drop'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {REMOVE} from 'Event/TemplateUpdateProvider'
import {DeepPartialSubstitute} from 'lib/type-utils'
import DragHandleBar from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/DragHandleBar'
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
  const {id} = props
  const updateTemplate = useSimpleBlogUpdate()

  const update = useCallback(
    (updated: DeepPartialSubstitute<SidebarItemProps, typeof REMOVE>) => {
      updateTemplate({
        sidebarItems: {
          [id]: updated,
        },
      })
    },
    [id, updateTemplate],
  )

  const remove = () => {
    updateTemplate({
      sidebarItems: {
        [id]: REMOVE,
      },
    })
  }

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
