import Grid from '@material-ui/core/Grid'
import NavButton, {NavButtonWithSize} from 'Dashboard/components/NavButton'
import EditComponent from 'Dashboard/edit/views/EditComponent'
import React from 'react'

export const MAIN_NAV_BUTTON = 'Main Nav Button'
type MainNavButtonProps = {
  id: string
  isEditMode?: boolean
  button: NavButtonWithSize
}

export default React.memo((props: MainNavButtonProps) => {
  return (
    <Grid item xs={12} md={props.button.size}>
      <EditComponent type={MAIN_NAV_BUTTON} id={props.id}>
        <NavButton {...props.button} ariaLabel="main nav button" />
      </EditComponent>
    </Grid>
  )
})
