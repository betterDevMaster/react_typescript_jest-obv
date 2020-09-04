import React from 'react'
import {
  SimpleBlogDashboard,
  SIMPLE_BLOG,
  SimpleBlog,
} from 'Dashboard/templates/SimpleBlog'
import {
  SIMPLE_BLOG_2,
  SimpleBlog2,
  SimpleBlog2Dashboard,
} from 'Dashboard/templates/SimpleBlog2'

export type Dashboard = SimpleBlogDashboard | SimpleBlog2Dashboard

export default function Dashboard(props: {dashboard: Dashboard}) {
  switch (props.dashboard.template) {
    case SIMPLE_BLOG:
      return <SimpleBlog dashboard={props.dashboard} />
    case SIMPLE_BLOG_2:
      return <SimpleBlog2 dashboard={props.dashboard} />
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
