import React from 'react'
import SidebarContainerConfig from 'organization/user/event/Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer/SidebarContainerConfig'
import EmojiListConfig from 'organization/user/event/Dashboard/components/EmojiList/EmojiListConfig'
import TicketRibbonConfig from 'organization/user/event/Dashboard/components/TicketRibbon/TicketRibbonConfig'
import {MAIN_NAV_BUTTON} from 'organization/user/event/Dashboard/Template/SimpleBlog/MainNav/MainNavButton'
import MainNavButtonConfig from 'organization/user/event/Dashboard/Template/SimpleBlog/MainNav/MainNavButton/MainNavButtonConfig'
import {WELCOME_TEXT} from 'organization/user/event/Dashboard/Template/SimpleBlog/WelcomeText'
import WelcomeTextConfig from 'organization/user/event/Dashboard/Template/SimpleBlog/WelcomeText/WelcomeTextConfig'
import {SIMPLE_BLOG} from 'organization/user/event/Dashboard/Template/SimpleBlog'
import SimpleBlogConfig from 'organization/user/event/Dashboard/Template/SimpleBlog/SimpleBlogConfig'
import {SIDEBAR_CONTAINER} from 'organization/user/event/Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
import {EMOJI_LIST} from 'organization/user/event/Dashboard/components/EmojiList'
import {TICKET_RIBBON_TYPE} from 'organization/user/event/Dashboard/components/TicketRibbon'
import {AGENDA} from 'organization/user/event/Dashboard/components/AgendaList'
import AgendaConfig from 'organization/user/event/Dashboard/components/AgendaList/AgendaConfig'
import {POINTS_SUMMARY} from 'organization/user/event/Dashboard/components/PointsSummary'
import PointsSummaryConfig from 'organization/user/event/Dashboard/components/PointsSummary/PointsSummaryConfig'
import {RESOURCE_ITEM, RESOURCE_LIST} from 'organization/user/event/Dashboard/components/ResourceList'
import ResourceListConfig from 'organization/user/event/Dashboard/components/ResourceList/ResourceListConfig'
import ResourceItemConfig from 'organization/user/event/Dashboard/components/ResourceList/ResourceItemConfig'
import SidebarNavButtonConfig from 'organization/user/event/Dashboard/Template/SimpleBlog/Sidebar/SidebarNavButtonConfig'
import {SIDEBAR_NAV_BUTTON} from 'organization/user/event/Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import {FOOTER} from 'organization/user/event/Dashboard/Template/SimpleBlog/Footer'
import FooterConfig from 'organization/user/event/Dashboard/Template/SimpleBlog/Footer/FooterConfig'
import {BLOG_POST} from 'organization/user/event/Dashboard/components/BlogPost'
import BlogPostConfig from 'organization/user/event/Dashboard/components/BlogPost/BlogPostConfig'

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
  | typeof BLOG_POST

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
    case BLOG_POST:
      return <BlogPostConfig id={props.config.id} />
    default:
      throw new Error(`Missing config component for type: ${props.config.type}`)
  }
}
