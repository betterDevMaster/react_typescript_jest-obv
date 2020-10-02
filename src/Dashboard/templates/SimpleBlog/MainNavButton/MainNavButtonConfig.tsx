import TextField from '@material-ui/core/TextField'
import {NavButtonWithSize} from 'Dashboard/components/NavButton'
import {useDashboard, useUpdateDashboard} from 'Dashboard/edit/state/utils'
import {onChangeHandler} from 'lib/dom'
import React from 'react'

export function MainNavButtonConfig(props: {id: string}) {
  const dashboard = useDashboard()

  const button = dashboard.mainNavButtons.entities[props.id]

  const update = useUpdateDashboard()

  const updateText = (text: string) => {
    const updated: NavButtonWithSize = {
      ...button,
      text,
    }

    update({
      mainNavButtons: {
        ...dashboard.mainNavButtons,
        entities: {
          ...dashboard.mainNavButtons.entities,
          [props.id]: updated,
        },
      },
    })
  }

  return (
    <>
      <TextField
        label="Text"
        value={button.text}
        inputProps={{
          'aria-label': 'button name input',
        }}
        onChange={onChangeHandler(updateText)}
      />
    </>
  )
}
