import React from 'react'
import Switch from '@material-ui/core/Switch'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import ColorPicker from 'lib/ui/ColorPicker'
import {onChangeCheckedHandler} from 'lib/dom'
import {handleChangeSlider} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import {Panels, usePanelsTemplate, usePanelsUpdate} from 'Event/template/Panels'
import {PreviewBox, SectionTitle} from 'organization/Event/Page'
import Login from 'Event/auth/Login'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {useForm, Controller} from 'react-hook-form'
import Button from '@material-ui/core/Button'

const MAX_LOGO_SIZE_PERCENT = 100
const MIN_LOGO_SIZE_PERCENT = 20

export default function LoginFormConfig() {
  const template = usePanelsTemplate()
  const update = usePanelsUpdate()
  const {handleSubmit, control, register} = useForm()

  const {login} = template
  const {event} = useEvent()

  const submit = (data: Panels) => {
    update(data)
  }

  return (
    <Layout>
      <Page>
        <SectionTitle>Login</SectionTitle>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit(submit)}>
              <Box display="flex" flexDirection="row" flex="2">
                <Box my={1} display="flex" flexDirection="column" flex="1">
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <EventImageUpload
                        label="Background"
                        property="login_background"
                        current={event.login_background}
                        width={1920}
                        height={1200}
                        canResize
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        flex="1"
                        mb={2}
                      >
                        <InputLabel>Hide Background</InputLabel>
                        <Controller
                          name="login.backgroundHidden"
                          defaultValue={login.backgroundHidden}
                          control={control}
                          render={({value, onChange}) => (
                            <Switch
                              checked={value}
                              onChange={onChangeCheckedHandler(onChange)}
                              color="primary"
                              inputProps={{
                                'aria-label': 'toggle background visible',
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <EventImageUpload
                        label="Logo"
                        property="login_logo"
                        current={event.login_logo}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        flex="1"
                        mb={2}
                      >
                        <InputLabel>Hide Logo</InputLabel>

                        <Controller
                          name="login.logoHidden"
                          defaultValue={login.logoHidden}
                          control={control}
                          render={({value, onChange}) => (
                            <Switch
                              checked={value}
                              onChange={onChangeCheckedHandler(onChange)}
                              color="primary"
                              inputProps={{
                                'aria-label': 'toggle logo visible',
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Box mb={1}>
                    <InputLabel>Logo Size</InputLabel>
                    <Controller
                      name="login.logoSize"
                      defaultValue={login.logoSize}
                      control={control}
                      render={({value, onChange}) => (
                        <Slider
                          valueLabelDisplay="auto"
                          aria-label="logo weight"
                          value={value}
                          onChange={handleChangeSlider(onChange)}
                          step={1}
                          min={MIN_LOGO_SIZE_PERCENT}
                          max={MAX_LOGO_SIZE_PERCENT}
                        />
                      )}
                    />
                  </Box>
                  <Controller
                    name="login.backgroundColor"
                    defaultValue={login.backgroundColor}
                    control={control}
                    render={({value, onChange}) => (
                      <ColorPicker
                        label="Background Color"
                        color={value || '#FFFFFF'}
                        onPick={onChange}
                        aria-label="login background color"
                      />
                    )}
                  />
                  <Box mb={1}>
                    <InputLabel>Background Opacity</InputLabel>

                    <Controller
                      name="login.backgroundOpacity"
                      defaultValue={login.backgroundOpacity}
                      control={control}
                      render={({value, onChange}) => (
                        <Slider
                          valueLabelDisplay="auto"
                          aria-label="logo background opacity"
                          value={value || 0}
                          valueLabelFormat={() => (
                            <div>{(login.backgroundOpacity || 0) * 100}</div>
                          )}
                          onChange={handleChangeSlider(onChange)}
                          step={0.01}
                          min={0}
                          max={1}
                        />
                      )}
                    />
                  </Box>
                  <Box display="flex" flexDirection="row" flex="2">
                    <Box mr={1} display="flex" flexDirection="column" flex="1">
                      <TextField
                        id="login-label-email"
                        label="Email Label"
                        name="login.emailLabel"
                        defaultValue={login.emailLabel}
                        inputProps={{
                          'aria-label': 'email label',
                          ref: register,
                        }}
                      />
                    </Box>
                    <Box ml={1} display="flex" flexDirection="column" flex="1">
                      <TextField
                        id="login-label-password"
                        label="Password Label"
                        name="login.passwordLabel"
                        defaultValue={login.passwordLabel}
                        inputProps={{
                          'aria-label': 'password label',
                          ref: register,
                        }}
                      />
                    </Box>
                  </Box>
                  <TextField
                    label="Submit Label"
                    name="login.submitButton.label"
                    defaultValue={login.submitButton.label}
                    inputProps={{
                      'aria-label': 'description text',
                      ref: register,
                    }}
                  />

                  <Controller
                    name="login.submitButton.backgroundColor"
                    defaultValue={login.submitButton.backgroundColor}
                    control={control}
                    render={({value, onChange}) => (
                      <BackgroundPicker
                        label="Submit Button Background"
                        background={value}
                        onChange={onChange}
                      />
                    )}
                  />

                  <Controller
                    name="login.submitButton.hoverColor"
                    defaultValue={login.submitButton.hoverColor}
                    control={control}
                    render={({value, onChange}) => (
                      <BackgroundPicker
                        label="Submit Button Hover Background"
                        background={value}
                        onChange={onChange}
                      />
                    )}
                  />

                  <Controller
                    name="login.submitButton.textColor"
                    defaultValue={login.submitButton.textColor}
                    control={control}
                    render={({value, onChange}) => (
                      <ColorPicker
                        label="Submit Button Color"
                        color={value}
                        onPick={onChange}
                        aria-label="submit button color"
                      />
                    )}
                  />

                  <TextField
                    id="description-text"
                    label="Description Text"
                    name="login.description.text"
                    defaultValue={login.description.text}
                    inputProps={{
                      'aria-label': 'description text',
                      ref: register,
                    }}
                  />

                  <Controller
                    name="login.description.color"
                    defaultValue={login.description.color}
                    control={control}
                    render={({value, onChange}) => (
                      <ColorPicker
                        label="Description Text Color"
                        color={value}
                        onPick={onChange}
                        aria-label="description text color"
                      />
                    )}
                  />

                  <InputLabel>Description Font Size</InputLabel>

                  <Controller
                    name="login.description.fontSize"
                    defaultValue={login.description.fontSize}
                    control={control}
                    render={({value, onChange}) => (
                      <Slider
                        valueLabelDisplay="auto"
                        aria-label="description font size"
                        value={value ? value : 20}
                        onChange={handleChangeSlider(onChange)}
                        step={1}
                        min={5}
                        max={50}
                      />
                    )}
                  />

                  <InputLabel>Input Border Radius</InputLabel>

                  <Controller
                    name="login.inputBorderRadius"
                    defaultValue={login.inputBorderRadius}
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

                  <InputLabel>Button Border Radius</InputLabel>
                  <Controller
                    name="login.submitButton.borderRadius"
                    defaultValue={login.submitButton.borderRadius}
                    control={control}
                    render={({value, onChange}) => (
                      <Slider
                        valueLabelDisplay="auto"
                        aria-label="button border radius"
                        value={value}
                        onChange={handleChangeSlider(onChange)}
                        step={1}
                        min={0}
                        max={60}
                      />
                    )}
                  />

                  <TextField
                    id="login-forgot-password-text"
                    label="Forgot Password Text"
                    name="login.passwordReset.linkLabel"
                    defaultValue={login.passwordReset.linkLabel}
                    inputProps={{
                      'aria-label': 'login forgot password text',
                      ref: register,
                    }}
                  />
                  <TextField
                    id="login-forgot-password-button-text"
                    label="Forgot Password Button Text"
                    name="login.passwordReset.buttonText"
                    defaultValue={login.passwordReset.buttonText}
                    inputProps={{
                      'aria-label': 'login forgot password button text',
                      ref: register,
                    }}
                  />
                  <TextField
                    id="login-forgot-password-description"
                    label="Forgot Password Description"
                    name="login.passwordReset.description"
                    defaultValue={login.passwordReset.description}
                    inputProps={{
                      'aria-label': 'login forgot password description',
                      ref: register,
                    }}
                  />
                  <TextField
                    id="login-forgot-password-message"
                    label="Forgot Password Description"
                    name="login.passwordReset.successMessage"
                    defaultValue={login.passwordReset.successMessage}
                    inputProps={{
                      'aria-label': 'login forgot password message',
                      ref: register,
                    }}
                  />
                </Box>
              </Box>
              <Button
                fullWidth
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
              <Login isPreview />
            </PreviewBox>
          </Grid>
        </Grid>
      </Page>
    </Layout>
  )
}
