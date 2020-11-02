import EditModeOnly from 'editor/views/EditModeOnly'
import MainNavButton from 'Dashboard/Template/SimpleBlog/MainNav/MainNavButton'
import NewMainNavButton from 'Dashboard/Template/SimpleBlog/MainNav/MainNavButton/NewMainNavButton'
import React from 'react'
import {useDashboard} from 'Dashboard/state/DashboardProvider'

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
