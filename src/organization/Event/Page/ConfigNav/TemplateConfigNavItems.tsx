import React from 'react'

import {useEvent} from 'Event/EventProvider'

import {CARDS} from 'Event/template/Cards'
import {PANELS} from 'Event/template/Panels'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'

import SimpleBlogConfigNavItems from 'Event/template/SimpleBlog/ConfigNavItems'
import PanelsConfigNavItems from 'Event/template/Panels/ConfigNavItems'
import CardsConfigNavItems from 'Event/template/Cards/ConfigNavItems'
import FiftyBlogConfigNavItems from 'Event/template/FiftyBlog/ConfigNavItems'

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
    case FIFTY_BLOG:
      return <FiftyBlogConfigNavItems />
    default:
      throw new Error(`Missing Template Config Nav Items for template`)
  }
}
