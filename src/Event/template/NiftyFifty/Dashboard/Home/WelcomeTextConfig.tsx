import React from 'react'
import {useForm} from 'react-hook-form'
import styled from 'styled-components'

import {Button, DialogContent, DialogTitle, TextField} from '@material-ui/core'

import {
  useNiftyFiftyUpdate,
  useNiftyFiftyTemplate,
  NiftyFifty,
} from 'Event/template/NiftyFifty'

import Dialog from 'lib/ui/Dialog'

export default function WelcomeTextConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const update = useNiftyFiftyUpdate()
  const template = useNiftyFiftyTemplate()
  const {handleSubmit, register, errors} = useForm()
  const {onClose} = props

  const {welcomeText, homeMenuTitle} = template
  const save = (data: Pick<NiftyFifty, 'welcomeText' | 'homeMenuTitle'>) => {
    update(data)
    onClose()
  }

  return (
    <Dialog open={props.isVisible} onClose={props.onClose} fullWidth>
      <form onSubmit={handleSubmit(save)}>
        <DialogTitle>Welcome Text</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Welcome Text"
            required
            inputProps={{
              'aria-label': 'welcome text',
              ref: register({required: 'Welcome Text is required.'}),
            }}
            defaultValue={welcomeText}
            name="welcomeText"
          />
          <TextField
            fullWidth
            inputProps={{
              'aria-label': 'home menu title',
              ref: register({required: 'Title is required.'}),
            }}
            label="Title"
            required
            defaultValue={homeMenuTitle}
            name="homeMenuTitle"
          />
          <SaveButton
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            aria-label="save welcome text"
          >
            SAVE
          </SaveButton>
        </DialogContent>
      </form>
    </Dialog>
  )
}

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
