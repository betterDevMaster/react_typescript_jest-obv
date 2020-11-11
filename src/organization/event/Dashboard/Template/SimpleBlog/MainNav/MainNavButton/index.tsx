import Grid from '@material-ui/core/Grid'
import HiddenOnMatch from 'organization/event/Dashboard/component-rules/HiddenOnMatch'
import NavButton, {NavButtonWithSize} from 'organization/event/Dashboard/components/NavButton'
import EditComponent from 'organization/event/Dashboard/editor/views/EditComponent'
import React from 'react'

export const MAIN_NAV_BUTTON = 'Main Nav Button'
type MainNavButtonProps = {
  id: string
  isEditMode?: boolean
  button: NavButtonWithSize
}

export default React.memo((props: MainNavButtonProps) => {
  return (
    <HiddenOnMatch rules={props.button.rules}>
      <Grid item xs={12} md={props.button.size}>
        <EditComponent type={MAIN_NAV_BUTTON} id={props.id}>
          <NavButton {...props.button} aria-label="main nav button" />
        </EditComponent>
      </Grid>
    </HiddenOnMatch>
  )
})
