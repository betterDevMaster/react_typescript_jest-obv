import React from 'react'
import {
  SimpleBlogDashboard,
  SIMPLE_BLOG,
  SimpleBlog,
} from 'Dashboard/templates/SimpleBlog'
import {User} from 'user'

export type Dashboard = SimpleBlogDashboard

export default function Dashboard(props: {dashboard: Dashboard; user: User}) {
  switch (props.dashboard.template) {
    case SIMPLE_BLOG:
      return <SimpleBlog dashboard={props.dashboard} user={props.user} />
    default:
      // Need to handle undefined case explicitly, because the dashboard could
      // have been bound globally (via Laravel), and there's no way to
      // verify the type at this point.
      throw new Error(
        //@ts-ignore
        `Missing component for template: ${props.dashboard.template}`,
      )
  }
}
