import React, {useEffect} from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import InputLabel from '@material-ui/core/InputLabel'
import ColorPicker from 'lib/ui/ColorPicker'
import {onChangeCheckedHandler} from 'lib/dom'
import {
  SimpleBlog,
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'
import {PreviewBox, SectionTitle} from 'organization/Event/Page'
import {TemplateSetPasswordForm} from 'Event/Step1/SetPasswordForm'
import {useTeamMember} from 'organization/auth'
import {useEvent, useUpdate} from 'Event/EventProvider'
import Switch from 'lib/ui/form/Switch'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {ObvioEvent} from 'Event'
import {Controller, useForm, UseFormMethods} from 'react-hook-form'
import Button from '@material-ui/core/Button'

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 60

type SetPassword = NonNullable<SimpleBlog['setPasswordForm']>

export default function SetPasswordFormConfig() {
  const {event} = useEvent()
  const {requires_attendee_password} = event
  const updateEvent = useUpdate()
  const {control, handleSubmit, register, watch, setValue} = useForm()
  const user = useTeamMember()
  const updateTemplate = useSimpleBlogUpdate()

  const submit = (
    data: Pick<SimpleBlog, 'setPasswordForm'> &
      Pick<ObvioEvent, 'requires_attendee_password'>,
  ) => {
    updateEvent({
      requires_attendee_password: data.requires_attendee_password,
    })
    updateTemplate({
      setPasswordForm: data.setPasswordForm,
    })
  }

  // Need to init 'requires_attendee_password' on load so the form knows
  // whether to show template config fields.
  const showingConfig = watch('requires_attendee_password')
  useEffect(() => {
    setValue('requires_attendee_password', requires_attendee_password)
  }, [requires_attendee_password, setValue])

  return (
    <Layout>
      <Page>
        <SectionTitle>Set Password Form</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12}></Grid>
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit(submit)}>
              <Controller
                name="requires_attendee_password"
                control={control}
                defaultValue={event.requires_attendee_password}
                render={({value, onChange}) => (
                  <Switch
                    onChange={onChangeCheckedHandler(onChange)}
                    labelPlacement="end"
                    checked={value}
                    aria-label="toggle requires attendee password"
                    label="Require password"
                    color="primary"
                  />
                )}
              />
              <TemplateConfigFields
                control={control}
                register={register}
                showing={showingConfig}
              />
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
        </Grid>
      </Page>
    </Layout>
  )
}

function TemplateConfigFields(
  props: {
    showing: boolean
  } & Pick<UseFormMethods, 'control' | 'register'>,
) {
  const {control, register, showing} = props
  const {setPasswordForm} = useSimpleBlogTemplate()

  if (!showing) {
    return null
  }

  return (
    <>
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
                onChange={onChange}
                step={1}
                min={MIN_BORDER_RADIUS}
                max={MAX_BORDER_RADIUS}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  )
}
