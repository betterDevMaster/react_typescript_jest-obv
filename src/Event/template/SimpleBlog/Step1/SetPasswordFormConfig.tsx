import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import InputLabel from '@material-ui/core/InputLabel'
import ColorPicker from 'lib/ui/ColorPicker'
import {onChangeCheckedHandler, handleChangeSlider} from 'lib/dom'
import {
  SimpleBlog,
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'
import {PreviewBox, SectionTitle} from 'organization/Event/Page'
import {TemplateSetPasswordForm} from 'Event/Step1/SetPasswordForm'
import {useEvent, useUpdate} from 'Event/EventProvider'
import Switch from 'lib/ui/form/Switch'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {Controller, useForm} from 'react-hook-form'
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
              label={event.requires_attendee_password ? 'Enabled' : 'Disabled'}
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

function Config() {
  const {event} = useEvent()
  const {setPasswordForm} = useSimpleBlogTemplate()
  const updateTemplate = useSimpleBlogUpdate()
  const {control, handleSubmit, register} = useForm()
  const user = useObvioUser()

  const submit = (data: Pick<SimpleBlog, 'setPasswordForm'>) => {
    updateTemplate({
      setPasswordForm: data.setPasswordForm,
    })
  }

  if (!event.requires_attendee_password) {
    return null
  }

  return (
    <>
      <Grid item xs={12} md={6}>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            name="setPasswordForm.title"
            defaultValue={setPasswordForm.title}
            label="Title"
            fullWidth
            inputProps={{
              'aria-label': 'set password form title',
              ref: register,
            }}
          />
          <TextField
            name="setPasswordForm.description"
            defaultValue={setPasswordForm.description}
            label="Description"
            fullWidth
            inputProps={{
              'aria-label': 'set password form description',
              ref: register,
            }}
          />
          <TextField
            name="setPasswordForm.passwordLabel"
            defaultValue={setPasswordForm.passwordLabel}
            label="Password Label"
            fullWidth
            inputProps={{
              'aria-label': 'password label',
              ref: register,
            }}
          />
          <TextField
            name="setPasswordForm.confirmPasswordLabel"
            defaultValue={setPasswordForm.confirmPasswordLabel}
            label="Confirm Password Label"
            fullWidth
            inputProps={{
              'aria-label': 'confirm password label',
              ref: register,
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="setPasswordForm.button.text"
                defaultValue={setPasswordForm.button.text}
                label="Button Label"
                fullWidth
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
              <InputLabel>Input Border Radius</InputLabel>
              <Controller
                name="setPasswordForm.inputBorderRadius"
                defaultValue={setPasswordForm.inputBorderRadius}
                control={control}
                render={({value, onChange}) => (
                  <Slider
                    valueLabelDisplay="auto"
                    aria-label="input border radius"
                    value={value}
                    onChange={handleChangeSlider(onChange)}
                    step={1}
                    min={0}
                    max={60}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel>Button Border Radius</InputLabel>
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
          </Grid>
          <Button
            variant="contained"
            aria-label="save"
            type="submit"
            color="primary"
          >
            Save
          </Button>
        </form>
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
