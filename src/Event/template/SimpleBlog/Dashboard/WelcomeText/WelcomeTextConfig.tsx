import TextField from '@material-ui/core/TextField'
import {
  useTemplate,
  useUpdateDashboard,
} from 'Event/Dashboard/state/TemplateProvider'
import {WELCOME_TEXT} from 'Event/template/SimpleBlog/Dashboard/WelcomeText'
import {onChangeStringHandler} from 'lib/dom'
import React from 'react'

export type WelcomeTextConfig = {
  type: typeof WELCOME_TEXT
}

export function WelcomeTextConfig() {
  const {welcomeText: value} = useTemplate()
  const updateDashboard = useUpdateDashboard()

  const update = (newVal: string) => {
    updateDashboard({
      welcomeText: newVal,
    })
  }
  return (
    <>
      <TextField
        value={value}
        onChange={onChangeStringHandler(update)}
        fullWidth
        label="Text"
        inputProps={{
          'aria-label': 'edit welcome text',
        }}
      />
    </>
  )
}
