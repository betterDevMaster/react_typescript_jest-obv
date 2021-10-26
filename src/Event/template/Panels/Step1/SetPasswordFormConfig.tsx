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
import {Panels, usePanels} from 'Event/template/Panels'
import {PreviewBox, SectionTitle} from 'organization/Event/Page'
import {TemplateSetPasswordForm} from 'Event/Step1/SetPasswordForm'
import {useTeamMember} from 'organization/auth'
import {useEvent, useUpdate} from 'Event/EventProvider'
import Switch from 'lib/ui/form/Switch'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 60

type SetPassword = NonNullable<Panels['setPasswordForm']>
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
    <Layout>
      <Page>
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
      </Page>
    </Layout>
  )
}

export function Config() {
  const {template, update} = usePanels()
  const user = useTeamMember()
  const {setPasswordForm} = template
  const {event} = useEvent()

  const updateSetPasswordForm = update.object('setPasswordForm')

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
      <SectionTitle>Set Password Form</SectionTitle>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
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
              <BackgroundPicker
                label="Button Background"
                background={setPasswordForm.button.backgroundColor}
                onChange={updateButton('backgroundColor')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BackgroundPicker
                label="Button Hover Background"
                background={setPasswordForm.button.hoverBackgroundColor}
                onChange={updateButton('hoverBackgroundColor')}
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
        <Grid item xs={12} md={12}>
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
      </Grid>
    </>
  )
}
