import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import InputLabel from '@material-ui/core/InputLabel'
import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import {Panels, usePanelsTemplate, usePanelsUpdate} from 'Event/template/Panels'
import {PreviewBox, SectionTitle} from 'organization/Event/Page'
import {TemplateSetPasswordForm} from 'Event/Step1/SetPasswordForm'
import {useEvent, useUpdate} from 'Event/EventProvider'
import Switch from 'lib/ui/form/Switch'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {useForm, Controller} from 'react-hook-form'
import Button from '@material-ui/core/Button'
import {useObvioUser} from 'obvio/auth'
import {useToggle} from 'lib/toggle'

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 60

export default function SetPasswordFormConfig() {
  const {event} = useEvent()
  const updateEvent = useUpdate()
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const setRequiresPassword = (requires_attendee_password: boolean) => {
    if (processing) {
      return
    }

    toggleProcessing()

    updateEvent({
      requires_attendee_password,
    }).finally(toggleProcessing)
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
              disabled={processing}
            />
          </Grid>
          <Config />
        </Grid>
      </Page>
    </Layout>
  )
}

export function Config() {
  const template = usePanelsTemplate()
  const update = usePanelsUpdate()
  const user = useObvioUser()
  const {event} = useEvent()

  const {handleSubmit, control, register} = useForm()
  const {setPasswordForm} = template

  const submit = (data: Panels) => {
    update(data)
  }

  if (!event.requires_attendee_password) {
    return null
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  name="setPasswordForm.title"
                  defaultValue={setPasswordForm.title}
                  inputProps={{
                    'aria-label': 'set password form title',
                    ref: register,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  name="setPasswordForm.description"
                  defaultValue={setPasswordForm.description}
                  inputProps={{
                    'aria-label': 'set password form description',
                    ref: register,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password Label"
                  fullWidth
                  name="setPasswordForm.passwordLabel"
                  defaultValue={setPasswordForm.passwordLabel}
                  inputProps={{
                    'aria-label': 'password label',
                    ref: register,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password Label"
                  fullWidth
                  name="setPasswordForm.confirmPasswordLabel"
                  defaultValue={setPasswordForm.confirmPasswordLabel}
                  inputProps={{
                    'aria-label': 'confirm password label',
                    ref: register,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Button Label"
                  fullWidth
                  name="setPasswordForm.button.text"
                  defaultValue={setPasswordForm.button.text}
                  inputProps={{
                    'aria-label': 'submit button label',
                    ref: register,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="setPasswordForm.button.backgroundColor"
                  defaultValue={setPasswordForm.button.backgroundColor}
                  control={control}
                  render={({value, onChange}) => (
                    <BackgroundPicker
                      label="Button Background"
                      background={value}
                      onChange={onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="setPasswordForm.button.hoverBackgroundColor"
                  defaultValue={setPasswordForm.button.hoverBackgroundColor}
                  control={control}
                  render={({value, onChange}) => (
                    <BackgroundPicker
                      label="Button Hover Background"
                      background={value}
                      onChange={onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="setPasswordForm.button.textColor"
                  defaultValue={setPasswordForm.button.textColor}
                  control={control}
                  render={({value, onChange}) => (
                    <ColorPicker
                      label="Button Text Color"
                      color={value}
                      onPick={onChange}
                      aria-label="button text color"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel>Border Radius</InputLabel>

                <Controller
                  name="setPasswordForm.button.borderRadius"
                  defaultValue={setPasswordForm.button.borderRadius}
                  control={control}
                  render={({value, onChange}) => (
                    <Slider
                      valueLabelDisplay="auto"
                      aria-label="button border radius"
                      value={value}
                      onChange={handleChangeSlider(onChange)}
                      step={1}
                      min={MIN_BORDER_RADIUS}
                      max={MAX_BORDER_RADIUS}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  variant="contained"
                  aria-label="save"
                  type="submit"
                  color="primary"
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={3} style={{marginTop: '15px'}}>
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
