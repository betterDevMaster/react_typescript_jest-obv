import {Event} from 'organization/Events'
import React from 'react'

export default function Card(props: {event: Event}) {
  return <div>{props.event.name}</div>
}
