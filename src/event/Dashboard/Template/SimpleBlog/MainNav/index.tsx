import EditModeOnly from 'event/Dashboard/editor/views/EditModeOnly'
import MainNavButton from 'event/Dashboard/Template/SimpleBlog/MainNav/MainNavButton'
import NewMainNavButton from 'event/Dashboard/Template/SimpleBlog/MainNav/MainNavButton/NewMainNavButton'
import React from 'react'
import {useDashboard} from 'event/Dashboard/state/DashboardProvider'

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
