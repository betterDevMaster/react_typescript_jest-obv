import React from 'react'
import {TemplateComponent} from 'Event/templates'
import {BaseEvent} from 'Event'

export const SIMPLE_BLOG = 'SIMPLE_BLOG'

export type SimpleBlogEvent = BaseEvent & {
  template: typeof SIMPLE_BLOG
  welcomeText: string
}

export const SimpleBlog: TemplateComponent = (props: {
  event: SimpleBlogEvent
}) => {
  return <div>{props.event.welcomeText}</div>
}
