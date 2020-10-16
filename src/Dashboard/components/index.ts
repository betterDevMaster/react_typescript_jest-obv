import {AGENDA} from 'Dashboard/components/AgendaList'
import {EMOJI_LIST} from 'Dashboard/components/EmojiList'
import {POINTS_SUMMARY} from 'Dashboard/components/PointsSummary'
import {RESOURCE_ITEM, RESOURCE_LIST} from 'Dashboard/components/ResourceList'
import {TICKET_RIBBON_TYPE} from 'Dashboard/components/TicketRibbon'
import {SIMPLE_BLOG} from 'Dashboard/Template/SimpleBlog'
import {MAIN_NAV_BUTTON} from 'Dashboard/Template/SimpleBlog/MainNavButtonList/MainNavButton'
import {SIDEBAR_CONTAINER} from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
import {SIDEBAR_NAV_BUTTON} from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import {WELCOME_TEXT} from 'Dashboard/Template/SimpleBlog/WelcomeText'

export interface Component {
  isEditMode?: boolean
}

// Must register component types here. This ensures wherever
// various component types are handled, that all possible
// components are accounted for.
export type ComponentType =
  | typeof SIMPLE_BLOG
  | typeof MAIN_NAV_BUTTON
  | typeof WELCOME_TEXT
  | typeof SIDEBAR_CONTAINER
  | typeof EMOJI_LIST
  | typeof TICKET_RIBBON_TYPE
  | typeof AGENDA
  | typeof POINTS_SUMMARY
  | typeof RESOURCE_LIST
  | typeof RESOURCE_ITEM
  | typeof SIDEBAR_NAV_BUTTON
