import React from 'react'
import SimpleBlog, {
  SIMPLE_BLOG,
} from 'organization/Events/Dashboard/Template/SimpleBlog'
import {DashboardProps} from 'organization/Events/Dashboard'
import {useDashboard} from 'organization/Events/Dashboard/state/DashboardProvider'

export default function Template(props: DashboardProps) {
  const dashboard = useDashboard()
  switch (dashboard.template) {
    case SIMPLE_BLOG:
      return <SimpleBlog user={props.user} />
    default:
      // Need to handle undefined case explicitly, because the dashboard could
      // have been bound globally (via Laravel), and there's no way to
      // verify the type at this point.
      throw new Error(
        //@ts-ignore
        `Missing component for template: ${dashboard.template}`,
      )
  }
}
