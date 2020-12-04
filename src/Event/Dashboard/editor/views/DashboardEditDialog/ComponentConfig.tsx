import React from 'react'
import {SidebarContainerConfig} from 'Event/Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer/SidebarContainerConfig'
import {EmojiListConfig} from 'Event/Dashboard/components/EmojiList/EmojiListConfig'
import {TicketRibbonConfig} from 'Event/Dashboard/components/TicketRibbon/TicketRibbonConfig'
import {MAIN_NAV_BUTTON} from 'Event/Dashboard/Template/SimpleBlog/MainNav/MainNavButton'
import {MainNavButtonConfig} from 'Event/Dashboard/Template/SimpleBlog/MainNav/MainNavButton/MainNavButtonConfig'
import {WELCOME_TEXT} from 'Event/Dashboard/Template/SimpleBlog/WelcomeText'
import {WelcomeTextConfig} from 'Event/Dashboard/Template/SimpleBlog/WelcomeText/WelcomeTextConfig'
import {SIMPLE_BLOG} from 'Event/Dashboard/Template/SimpleBlog'
import {SimpleBlogConfig} from 'Event/Dashboard/Template/SimpleBlog/SimpleBlogConfig'
import {SIDEBAR_CONTAINER} from 'Event/Dashboard/Template/SimpleBlog/Sidebar/SidebarContainer'
import {EMOJI_LIST} from 'Event/Dashboard/components/EmojiList'
import {TICKET_RIBBON_TYPE} from 'Event/Dashboard/components/TicketRibbon'
import {AGENDA} from 'Event/Dashboard/components/AgendaList'
import {AgendaConfig} from 'Event/Dashboard/components/AgendaList/AgendaConfig'
import {POINTS_SUMMARY} from 'Event/Dashboard/components/PointsSummary'
import {PointsSummaryConfig} from 'Event/Dashboard/components/PointsSummary/PointsSummaryConfig'
import {
  RESOURCE_ITEM,
  RESOURCE_LIST,
} from 'Event/Dashboard/components/ResourceList'
import {ResourceListConfig} from 'Event/Dashboard/components/ResourceList/ResourceListConfig'
import {ResourceItemConfig} from 'Event/Dashboard/components/ResourceList/ResourceItemConfig'
import {SidebarNavButtonConfig} from 'Event/Dashboard/Template/SimpleBlog/Sidebar/SidebarNavButtonConfig'
import {SIDEBAR_NAV_BUTTON} from 'Event/Dashboard/Template/SimpleBlog/Sidebar/SidebarNav'
import {FOOTER} from 'Event/Dashboard/Template/SimpleBlog/Footer'
import {FooterConfig} from 'Event/Dashboard/Template/SimpleBlog/Footer/FooterConfig'
import {BLOG_POST} from 'Event/Dashboard/components/BlogPost'
import {BlogPostConfig} from 'Event/Dashboard/components/BlogPost/BlogPostConfig'

// Must register config types here. This ensures wherever
// various component types are handled, that all possible
// components are accounted for.
export type ComponentConfig =
  | SimpleBlogConfig
  | MainNavButtonConfig
  | WelcomeTextConfig
  | SidebarContainerConfig
  | EmojiListConfig
  | TicketRibbonConfig
  | AgendaConfig
  | PointsSummaryConfig
  | ResourceListConfig
  | ResourceItemConfig
  | SidebarNavButtonConfig
  | FooterConfig
  | BlogPostConfig

export function ComponentConfig(props: {config: ComponentConfig | null}) {
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
      // @ts-ignore
      throw new Error(`Missing config component for type: ${props.config.type}`)
  }
}
