import {CARDS} from 'Event/template/Cards'
import {PANELS} from 'Event/template/Panels'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import React from 'react'
import SimpleBlogConfigNavItems from 'Event/template/SimpleBlog/ConfigNavItems'
import PanelsConfigNavItems from 'Event/template/Panels/ConfigNavItems'
import CardsConfigNavItems from 'Event/template/Cards/ConfigNavItems'
import {useEvent} from 'Event/EventProvider'

export default function TemplateConfigNavItems() {
  const {event} = useEvent()
  const template = event.template?.name

  switch (template) {
    case SIMPLE_BLOG:
      return <SimpleBlogConfigNavItems />
    case PANELS:
      return <PanelsConfigNavItems />
    case CARDS:
      return <CardsConfigNavItems />
    default:
      return null
  }
}
