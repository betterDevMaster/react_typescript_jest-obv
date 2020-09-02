import {Template, componentFor} from 'Event/templates'
import React from 'react'
import {SimpleBlogEvent} from 'Event/templates/SimpleBlog'

export interface BaseEvent {
  template: Template
}

export type Event = SimpleBlogEvent

export default function Event(props: {event: Event}) {
  const TemplateComponent = componentFor(props.event.template)

  return <TemplateComponent event={props.event} />
}
