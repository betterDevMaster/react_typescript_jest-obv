import {Editable} from 'Dashboard'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import MainNavButton from 'Dashboard/Template/SimpleBlog/MainNavButtonList/MainNavButton'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'

export default function MainNavButtonList(
  props: {
    buttons: SimpleBlog['mainNavButtons']
  } & Editable,
) {
  const buttons = useCurrentButtons(props.isEditMode, props.buttons)

  return (
    <>
      {buttons.ids.map((id) => (
        <MainNavButton
          key={id}
          id={id}
          isEditMode={props.isEditMode}
          button={buttons.entities[id]}
        />
      ))}
    </>
  )
}

function useCurrentButtons(
  isEditMode: boolean,
  saved: SimpleBlog['mainNavButtons'],
) {
  const current = useSelector(
    (state: RootState) => state.dashboardEditor.mainNavButtons,
  )

  if (!isEditMode || !current) {
    return saved
  }

  return current
}
