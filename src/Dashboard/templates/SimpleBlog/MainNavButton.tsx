import Grid from '@material-ui/core/Grid'
import NavButton from 'Dashboard/components/NavButton'
import {SimpleBlogDashboard} from 'Dashboard/templates/SimpleBlog'
import React from 'react'

export default function MainNavButton(props: {
  buttons: SimpleBlogDashboard['mainNavButtons']
  id: string
  isEditMode: boolean
}) {
  const button = props.buttons.entities[props.id]

  return (
    <Grid item xs={12} md={button.size}>
      <NavButton
        {...button}
        ariaLabel="main nav button"
        isEditMode={props.isEditMode}
      />
    </Grid>
  )
}
