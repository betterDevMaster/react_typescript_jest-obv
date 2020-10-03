import React from 'react'
import SimpleBlog, {SIMPLE_BLOG} from 'Dashboard/Template/SimpleBlog'
import {DashboardProps} from 'Dashboard'

export default function Template(props: DashboardProps) {
  switch (props.dashboard.template) {
    case SIMPLE_BLOG:
      return (
        <SimpleBlog
          dashboard={props.dashboard}
          user={props.user}
          isEditMode={props.isEditMode}
        />
      )
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
