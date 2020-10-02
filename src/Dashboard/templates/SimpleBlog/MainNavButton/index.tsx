import Grid from '@material-ui/core/Grid'
import NavButton from 'Dashboard/components/NavButton'
import EditComponent from 'Dashboard/edit/views/EditComponent'
import {SimpleBlogDashboard} from 'Dashboard/templates/SimpleBlog'
import React from 'react'

export const MAIN_NAV_BUTTON = 'MAIN_NAV_BUTTON'

export default function MainNavButton(props: {
  buttons: SimpleBlogDashboard['mainNavButtons']
  id: string
  isEditMode?: boolean
}) {
  const button = props.buttons.entities[props.id]

  if (props.isEditMode) {
    return (
      <Grid item xs={12} md={button.size}>
        <EditComponent type={MAIN_NAV_BUTTON} id={props.id}>
          <NavButton
            {...button}
            id={props.id}
            ariaLabel="main nav button"
            isEditMode={false}
          />
        </EditComponent>
      </Grid>
    )
  }

  return (
    <Grid item xs={12} md={button.size}>
      <NavButton
        {...button}
        id={props.id}
        ariaLabel="main nav button"
        isEditMode={false}
      />
    </Grid>
  )
}
