import {useCurrent} from 'Dashboard/edit/state/edit-mode'
import EditModeOnly from 'Dashboard/edit/views/EditModeOnly'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import MainNavButton from 'Dashboard/Template/SimpleBlog/MainNav/MainNavButton'
import NewMainNavButton from 'Dashboard/Template/SimpleBlog/MainNav/MainNavButton/NewMainNavButton'
import React from 'react'

export default function MainNav(props: {buttons: SimpleBlog['mainNav']}) {
  const buttons = useCurrent(
    (state) => state.dashboardEditor.mainNav,
    props.buttons,
  )

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
