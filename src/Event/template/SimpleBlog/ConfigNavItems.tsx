import React from 'react'
import ConfigNavItem from 'organization/Event/Page/ConfigNav/ConfigNavItem'
import {useEventRoutes} from 'organization/Event/EventRoutes'

export default function SimpleBlogConfigNavItems() {
  const routes = useEventRoutes()

  return (
    <>
      <ConfigNavItem to={routes.login} aria-label="edit login">
        Login
      </ConfigNavItem>
      <ConfigNavItem to={routes.event_offline} aria-label="event offline">
        Event Offline
      </ConfigNavItem>
      <ConfigNavItem to={routes.password_create} aria-label="password create">
        Password Create
      </ConfigNavItem>
      <ConfigNavItem to={routes.progress_bar} aria-label="progress bar">
        Progress Bar
      </ConfigNavItem>
      <ConfigNavItem to={routes.global_styles} aria-label="global styles">
        Global Styles
      </ConfigNavItem>
    </>
  )
}
