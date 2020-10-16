import {useCurrent} from 'Dashboard/edit/state/edit-mode'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import MainNavButton from 'Dashboard/Template/SimpleBlog/MainNavButtonList/MainNavButton'
import React from 'react'

export default function MainNavButtonList(props: {
  buttons: SimpleBlog['mainNavButtons']
}) {
  const buttons = useCurrent(
    (state) => state.dashboardEditor.mainNavButtons,
    props.buttons,
  )

  return (
    <>
      {buttons.ids.map((id) => (
        <MainNavButton key={id} id={id} button={buttons.entities[id]} />
      ))}
    </>
  )
}
