import React from 'react'
import SidebarContainerConfig from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer/SidebarContainerConfig'
import EmojiListConfig from 'Dashboard/components/EmojiList/EmojiListConfig'
import TicketRibbonConfig from 'Dashboard/components/TicketRibbon/TicketRibbonConfig'
import {MAIN_NAV_BUTTON} from 'Dashboard/Template/SimpleBlog/MainNavButtonList/MainNavButton'
import MainNavButtonConfig from 'Dashboard/Template/SimpleBlog/MainNavButtonList/MainNavButton/MainNavButtonConfig'
import {WELCOME_TEXT} from 'Dashboard/Template/SimpleBlog/WelcomeText'
import WelcomeTextConfig from 'Dashboard/Template/SimpleBlog/WelcomeText/WelcomeTextConfig'
import {SIMPLE_BLOG} from 'Dashboard/Template/SimpleBlog'
import SimpleBlogConfig from 'Dashboard/Template/SimpleBlog/SimpleBlogConfig'
import {SIDEBAR_CONTAINER} from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
import {EMOJI_LIST} from 'Dashboard/components/EmojiList'
import {TICKET_RIBBON_TYPE} from 'Dashboard/components/TicketRibbon'
import {AGENDA} from 'Dashboard/components/AgendaList'
import AgendaConfig from 'Dashboard/components/AgendaList/AgendaConfig'
import {POINTS_SUMMARY} from 'Dashboard/components/PointsSummary'
import PointsSummaryConfig from 'Dashboard/components/PointsSummary/PointsSummaryConfig'
import {RESOURCE_ITEM, RESOURCE_LIST} from 'Dashboard/components/ResourceList'
import ResourceListConfig from 'Dashboard/components/ResourceList/ResourceListConfig'
import ResourceItemConfig from 'Dashboard/components/ResourceList/ResourceItemConfig'
import SidebarNavButtonConfig from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarNavButtonConfig'
import {SIDEBAR_NAV_BUTTON} from 'Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import {FOOTER} from 'Dashboard/Template/SimpleBlog/Footer'
import FooterConfig from 'Dashboard/Template/SimpleBlog/Footer/FooterConfig'

export interface Config {
  type: ConfigType
  id?: string | number
}

// Must register config types here. This ensures wherever
// various component types are handled, that all possible
// components are accounted for.
export type ConfigType =
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
  | typeof FOOTER

export default function ConfigComponent(props: {config: Config | null}) {
  if (!props.config) {
    return null
  }

  switch (props.config.type) {
    case MAIN_NAV_BUTTON:
      return <MainNavButtonConfig id={props.config.id} />
    case WELCOME_TEXT:
      return <WelcomeTextConfig />
    case SIMPLE_BLOG:
      return <SimpleBlogConfig />
    case SIDEBAR_CONTAINER:
      return <SidebarContainerConfig />
    case EMOJI_LIST:
      return <EmojiListConfig />
    case TICKET_RIBBON_TYPE:
      return <TicketRibbonConfig />
    case AGENDA:
      return <AgendaConfig id={props.config.id} />
    case POINTS_SUMMARY:
      return <PointsSummaryConfig />
    case RESOURCE_LIST:
      return <ResourceListConfig />
    case RESOURCE_ITEM:
      return <ResourceItemConfig id={props.config.id} />
    case SIDEBAR_NAV_BUTTON:
      return <SidebarNavButtonConfig id={props.config.id} />
    case FOOTER:
      return <FooterConfig />
    default:
      throw new Error(`Missing config component for type: ${props.config.type}`)
  }
}
