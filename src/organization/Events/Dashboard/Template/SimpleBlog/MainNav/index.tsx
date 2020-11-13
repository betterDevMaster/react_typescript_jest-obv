import EditModeOnly from 'organization/Events/Dashboard/editor/views/EditModeOnly'
import MainNavButton from 'organization/Events/Dashboard/Template/SimpleBlog/MainNav/MainNavButton'
import NewMainNavButton from 'organization/Events/Dashboard/Template/SimpleBlog/MainNav/MainNavButton/NewMainNavButton'
import React from 'react'
import {useDashboard} from 'organization/Events/Dashboard/state/DashboardProvider'

export default function MainNav() {
  const {mainNav: buttons} = useDashboard()

  return (
    <>
      {buttons.ids.map((id) => (
        <MainNavButton key={id} id={id} button={buttons.entities[id]} />
      ))}
      <EditModeOnly>
        <NewMainNavButton />
      </EditModeOnly>
    </>
  )
}
