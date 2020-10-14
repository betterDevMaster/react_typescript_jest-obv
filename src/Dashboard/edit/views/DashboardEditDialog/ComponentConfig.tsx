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
import {Component} from 'Dashboard/edit/state/actions'
import {AGENDA} from 'Dashboard/components/AgendaList'
import AgendaConfig from 'Dashboard/components/AgendaList/AgendaConfig'

export function ComponentConfig(props: {component: Component | null}) {
  if (!props.component) {
    return null
  }

  switch (props.component.type) {
    case MAIN_NAV_BUTTON:
      return <MainNavButtonConfig id={props.component.id} />
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
      return <AgendaConfig component={props.component} />
    default:
      throw new Error(
        `Missing config component for type: ${props.component.type}`,
      )
  }
}
