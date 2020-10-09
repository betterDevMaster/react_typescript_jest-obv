import {EMOJI_LIST} from 'Dashboard/components/EmojiList'
import {TICKET_RIBBON_TYPE} from 'Dashboard/components/TicketRibbon'
import {SIMPLE_BLOG} from 'Dashboard/Template/SimpleBlog'
import {MAIN_NAV_BUTTON} from 'Dashboard/Template/SimpleBlog/MainNavButtonList/MainNavButton'
import {SIDEBAR_CONTAINER} from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
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
