import React, {useState, useEffect} from 'react'
import {useForm, Controller} from 'react-hook-form'
import styled from 'styled-components'

import {Grid, InputLabel, Slider, TextField} from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'

import {
  NiftyFifty,
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'
import {PreviewBox, SectionTitle} from 'organization/Event/Page'
import {TemplateSetPasswordForm} from 'Event/Step1/SetPasswordForm'
import {useEvent, useUpdate} from 'Event/EventProvider'

import Switch from 'lib/ui/form/Switch'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import TextEditor from 'lib/ui/form/TextEditor'
import {useToggle} from 'lib/toggle'
import {spacing} from 'lib/ui/theme'

import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {useObvioUser} from 'obvio/auth'
import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'

const MIN_BUTTON_BORDER_RADIUS = 0
const MAX_BUTTON_BORDER_RADIUS = 20
const MIN_BUTTON_BORDER_WIDTH = 0
const MAX_BUTTON_BORDER_WIDTH = 20

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
        <Grid container>
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
  const template = useNiftyFiftyTemplate()
  const update = useNiftyFiftyUpdate()
  const user = useObvioUser()
  const {event} = useEvent()

  const {register, handleSubmit, setValue, control} = useForm()

  const {setPasswordForm} = template
  const [loading, setLoading] = useState(true)

  const submit = (data: NiftyFifty) => {
    update(data)
  }

  useEffect(() => {
    setValue('setPasswordForm.description', setPasswordForm.description)

    setLoading(false)
  }, [setPasswordForm, setValue])

  if (!event.requires_attendee_password) {
    return null
  }

  return (
    <>
      <StyledForm onSubmit={handleSubmit(submit)}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Grid container>
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
                <Editor>
                  <input
                    type="hidden"
                    name="setPasswordForm.description"
                    aria-label="set password form description"
                    ref={register({required: 'Description is required.'})}
                  />
                  <BodyLabel>Description</BodyLabel>
                  {loading ? null : (
                    <TextEditor
                      data={setPasswordForm.description}
                      onChange={(val) =>
                        setValue('setPasswordForm.description', val)
                      }
                    />
                  )}
                </Editor>
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
                      max={20}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="setPasswordForm.inputBackgroundColor"
                  defaultValue={setPasswordForm.inputBackgroundColor}
                  control={control}
                  render={({value, onChange}) => (
                    <BackgroundPicker
                      label="Input Background Color"
                      background={value}
                      onChange={onChange}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container>
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
                      min={MIN_BUTTON_BORDER_RADIUS}
                      max={MAX_BUTTON_BORDER_RADIUS}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="setPasswordForm.button.borderColor"
                  defaultValue={setPasswordForm.button.borderColor}
                  control={control}
                  render={({value, onChange}) => (
                    <ColorPicker
                      label="Button Border Color"
                      color={value}
                      onPick={onChange}
                      aria-label="button border color"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel>Button Border Width</InputLabel>

                <Controller
                  name="setPasswordForm.button.borderWidth"
                  defaultValue={setPasswordForm.button.borderWidth}
                  control={control}
                  render={({value, onChange}) => (
                    <Slider
                      valueLabelDisplay="auto"
                      aria-label="button border width"
                      value={value}
                      onChange={handleChangeSlider(onChange)}
                      step={1}
                      min={MIN_BUTTON_BORDER_WIDTH}
                      max={MAX_BUTTON_BORDER_WIDTH}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel>Button Size</InputLabel>

                <Controller
                  name="setPasswordForm.button.width"
                  defaultValue={setPasswordForm.button.width}
                  control={control}
                  render={({value, onChange}) => (
                    <Slider
                      valueLabelDisplay="auto"
                      aria-label="button width"
                      value={value}
                      onChange={handleChangeSlider(onChange)}
                      step={1}
                      min={1}
                      max={12}
                    />
                  )}
                />
              </Grid>
              <SaveButton />
            </Grid>
          </Grid>
        </Grid>
      </StyledForm>
      <Grid container style={{marginTop: '15px'}}>
        <Grid item xs={12} md={12}>
          <PreviewBodyLabel>Preview</PreviewBodyLabel>
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

const Editor = styled.div`
  margin-top: ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[6]};

  .ck-editor__editable_inline {
    max-height: 600px;
  }
`

const BodyLabel = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(InputLabel)
const StyledForm = styled.form`
  width: 100%;
`
const PreviewBodyLabel = styled(BodyLabel)`
  margin-top: ${(props) => props.theme.spacing[4]};
`
