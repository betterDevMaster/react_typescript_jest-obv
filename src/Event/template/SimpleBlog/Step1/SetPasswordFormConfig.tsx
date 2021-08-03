import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import InputLabel from '@material-ui/core/InputLabel'
import ColorPicker from 'lib/ui/ColorPicker'
import {
  handleChangeSlider,
  onChangeCheckedHandler,
  onChangeStringHandler,
} from 'lib/dom'
import {SimpleBlog, useSimpleBlog} from 'Event/template/SimpleBlog'
import {PreviewBox, SectionTitle} from 'organization/Event/GeneralConfig'
import {TemplateSetPasswordForm} from 'Event/Step1/SetPasswordForm'
import {useTeamMember} from 'organization/auth'
import {useEvent, useUpdate} from 'Event/EventProvider'
import Switch from 'lib/ui/form/Switch'

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 60

type SetPassword = NonNullable<SimpleBlog['setPasswordForm']>
type SetPasswordButton = NonNullable<SetPassword['button']>

export default function SetPasswordFormConfig() {
  const {event} = useEvent()
  const updateEvent = useUpdate()

  const setRequiresPassword = (requires_attendee_password: boolean) => {
    updateEvent({
      requires_attendee_password,
    })
  }

  return (
    <>
      <SectionTitle>Set Password Form</SectionTitle>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Switch
            onChange={onChangeCheckedHandler(setRequiresPassword)}
            labelPlacement="end"
            checked={event.requires_attendee_password}
            aria-label="toggle requires attendee password"
            label="Require password"
            color="primary"
          />
        </Grid>
        <Config />
      </Grid>
    </>
  )
}

function Config() {
  const {template, update} = useSimpleBlog()
  const {setPasswordForm} = template
  const user = useTeamMember()
  const updateSetPasswordForm = update.object('setPasswordForm')
  const {event} = useEvent()

  const updateButton = <T extends keyof SetPasswordButton>(key: T) => (
    value: SetPasswordButton[T],
  ) => {
    const current = setPasswordForm?.button || {}
    const button = {
      ...current,
      [key]: value,
    }

    updateSetPasswordForm('button')(button)
  }

  if (!event.requires_attendee_password) {
    return null
  }

  return (
    <>
      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={setPasswordForm.title}
              label="Title"
              fullWidth
              inputProps={{
                'aria-label': 'set password form title',
              }}
              onChange={onChangeStringHandler(updateSetPasswordForm('title'))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={setPasswordForm.description}
              label="Description"
              fullWidth
              inputProps={{
                'aria-label': 'set password form description',
              }}
              onChange={onChangeStringHandler(
                updateSetPasswordForm('description'),
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={setPasswordForm.passwordLabel}
              label="Password Label"
              fullWidth
              inputProps={{
                'aria-label': 'password label',
              }}
              onChange={onChangeStringHandler(
                updateSetPasswordForm('passwordLabel'),
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={setPasswordForm.confirmPasswordLabel}
              label="Confirm Password Label"
              fullWidth
              inputProps={{
                'aria-label': 'confirm password label',
              }}
              onChange={onChangeStringHandler(
                updateSetPasswordForm('confirmPasswordLabel'),
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              value={setPasswordForm.button.text}
              label="Button Label"
              fullWidth
              inputProps={{
                'aria-label': 'submit button label',
              }}
              onChange={onChangeStringHandler(updateButton('text'))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ColorPicker
              label="Button Background Color"
              color={setPasswordForm.button.backgroundColor}
              onPick={updateButton('backgroundColor')}
              aria-label="button background color"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ColorPicker
              label="Button Hover Background Color"
              color={setPasswordForm.button.hoverBackgroundColor}
              onPick={updateButton('hoverBackgroundColor')}
              aria-label="button hover background color"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ColorPicker
              label="Button Text Color"
              color={setPasswordForm.button.textColor}
              onPick={updateButton('textColor')}
              aria-label="button text color"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>Border Radius</InputLabel>
            <Slider
              valueLabelDisplay="auto"
              aria-label="button border radius"
              value={setPasswordForm.button.borderRadius}
              onChange={handleChangeSlider(updateButton('borderRadius'))}
              step={1}
              min={MIN_BORDER_RADIUS}
              max={MAX_BORDER_RADIUS}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <PreviewBox>
          <TemplateSetPasswordForm
            submit={() => {}}
            submitting={false}
            responseError={null}
            progress={25}
            user={user}
          />
        </PreviewBox>
      </Grid>
    </>
  )
}
