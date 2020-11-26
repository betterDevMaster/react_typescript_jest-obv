import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import MainNavButton from 'Event/Dashboard/Template/SimpleBlog/MainNav/MainNavButton'
import NewMainNavButton from 'Event/Dashboard/Template/SimpleBlog/MainNav/MainNavButton/NewMainNavButton'
import React from 'react'
import {useDashboard} from 'Event/Dashboard/state/DashboardProvider'

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
