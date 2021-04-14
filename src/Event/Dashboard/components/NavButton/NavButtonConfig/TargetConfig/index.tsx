import FormControl from '@material-ui/core/FormControl'
import React from 'react'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import AreaConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig/AreaConfig'
import LinkConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig/LinkConfig'
import {ButtonConfigProps} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'
import NavButton from 'Event/Dashboard/components/NavButton'

export default function TargetConfig<T extends NavButton>(
  props: ButtonConfigProps<T>,
) {
  const {update, button} = props

  return (
    <>
      <FormControl>
        <ToggleButtonGroup
          value={button.isAreaButton ? 'true' : 'false'}
          exclusive
        >
          <ToggleButton
            value="false"
            onClick={() => update('isAreaButton')(false)}
          >
            Link
          </ToggleButton>
          <ToggleButton
            value="true"
            aria-label="configure button to join room"
            onClick={() => update('isAreaButton')(true)}
          >
            Join Room
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
      <LinkConfig {...props} />
      <AreaConfig {...props} />
    </>
  )
}
