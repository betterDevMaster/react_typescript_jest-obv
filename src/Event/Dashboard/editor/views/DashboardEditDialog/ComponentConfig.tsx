import React from 'react'
import {SidebarContainerConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer/SidebarContainerConfig'
import {EmojiListConfig} from 'Event/template/SimpleBlog/Dashboard/EmojiList/EmojiListConfig'
import {TicketRibbonConfig} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig'
import {MAIN_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton'
import {MainNavButtonConfig} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'
import {SimpleBlogConfig} from 'Event/template/SimpleBlog/SimpleBlogConfig'
import {SIDEBAR_CONTAINER} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import {EMOJI_LIST} from 'Event/template/SimpleBlog/Dashboard/EmojiList'
import {TICKET_RIBBON} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbon'
import {AGENDA_ITEM} from 'Event/template/SimpleBlog/Dashboard/AgendaList'
import {AGENDA_LIST} from 'Event/template/SimpleBlog/Dashboard/AgendaList'
import {AgendaItemConfig} from 'Event/template/SimpleBlog/Dashboard/AgendaList/AgendaItemConfig'
import {AgendaListConfig} from 'Event/template/SimpleBlog/Dashboard/AgendaList/AgendaListConfig'
import {POINTS_SUMMARY} from 'Event/template/SimpleBlog/Dashboard/PointsSummary'
import {PointsSummaryConfig} from 'Event/template/SimpleBlog/Dashboard/PointsSummary/PointsSummaryConfig'
import {
  RESOURCE_ITEM,
  RESOURCE_LIST,
} from 'Event/template/SimpleBlog/Dashboard/ResourceList'
import {ResourceListConfig} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceListConfig'
import {ResourceItemConfig} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceItemConfig'
import {SidebarNavButtonConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNavButtonConfig'
import {SIDEBAR_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'
import {FOOTER} from 'Event/template/SimpleBlog/Dashboard/Footer'
import {FooterConfig} from 'Event/template/SimpleBlog/Dashboard/Footer/FooterConfig'
import {BLOG_POST} from 'Event/template/SimpleBlog/Dashboard/BlogPosts/BlogPost'
import {BlogPostConfig} from 'Event/template/SimpleBlog/Dashboard/BlogPosts/BlogPost/BlogPostConfig'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {HeroConfig} from 'Event/template/SimpleBlog/Dashboard/Hero/HeroConfig'
import {HERO} from 'Event/template/SimpleBlog/Dashboard/Hero'
import {BodyHTMLEmbedConfig} from 'Event/template/SimpleBlog/Dashboard/BodyHTMLEmbed/BodyHTMLEmbedConfig'
import {BODY_HTML_EMBED} from 'Event/template/SimpleBlog/Dashboard/BodyHTMLEmbed'

// Must register config types here. This ensures wherever
// various component types are handled, that all possible
// components are accounted for.
export type ComponentConfig =
  | SimpleBlogConfig
  | MainNavButtonConfig
  | HeroConfig
  | SidebarContainerConfig
  | EmojiListConfig
  | TicketRibbonConfig
  | AgendaListConfig
  | AgendaItemConfig
  | PointsSummaryConfig
  | ResourceListConfig
  | ResourceItemConfig
  | SidebarNavButtonConfig
  | FooterConfig
  | BlogPostConfig
  | BodyHTMLEmbedConfig

export function ComponentConfig(props: {config: ComponentConfig | null}) {
  if (!props.config) {
    return null
  }

  switch (props.config.type) {
    case MAIN_NAV_BUTTON:
      return <MainNavButtonConfig id={props.config.id} />
    case HERO:
      return <HeroConfig />
    case SIMPLE_BLOG:
      return <SimpleBlogConfig />
    case SIDEBAR_CONTAINER:
      return <SidebarContainerConfig />
    case EMOJI_LIST:
      return <EmojiListConfig />
    case TICKET_RIBBON:
      return <TicketRibbonConfig index={props.config.index} />
    case AGENDA_LIST:
      return <AgendaListConfig />
    case AGENDA_ITEM:
      return <AgendaItemConfig id={props.config.id} />
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
    case BODY_HTML_EMBED:
      return <BodyHTMLEmbedConfig />
    default:
      // @ts-ignore
      throw new Error(`Missing config component for type: ${props.config.type}`)
  }
}
