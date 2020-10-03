import TextField from '@material-ui/core/TextField'
import {NavButtonWithSize} from 'Dashboard/components/NavButton'
import {setDashboard} from 'Dashboard/edit/state/actions'
import {onChangeHandler} from 'lib/dom'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export function MainNavButtonConfig(props: {id: string}) {
  const buttons = useSelector(
    (state: RootState) => state.dashboardEditor.mainNavButtons,
  )

  const dispatch = useDispatch()

  if (!buttons) {
    throw new Error('Missing nav buttons')
  }
  const button = buttons.entities[props.id]

  const updateText = (text: string) => {
    const updated: NavButtonWithSize = {
      ...button,
      text,
    }

    dispatch(
      setDashboard({
        mainNavButtons: {
          ...buttons,
          entities: {
            ...buttons.entities,
            [props.id]: updated,
          },
        },
      }),
    )
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
