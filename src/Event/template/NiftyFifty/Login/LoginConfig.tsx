import React from 'react'
import {useForm, Controller} from 'react-hook-form'

import {
  Box,
  Button,
  Grid,
  InputLabel,
  Slider,
  TextField,
} from '@material-ui/core'

import Login from 'Event/auth/Login'
import {
  NiftyFifty,
  MAX_LOGO_SIZE_PERCENT,
  MIN_LOGO_SIZE_PERCENT,
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'
import BackgroundImageUploader from 'Event/template/NiftyFifty/GlobalStylesConfig/BackgroundImageUploader'

import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import Switch from 'lib/ui/form/Switch'
import {numberFormat} from 'lib/numberFormat'

import Page, {PreviewBox, SectionTitle} from 'organization/Event/Page'
import Layout from 'organization/user/Layout'

export default function LoginFormConfig() {
  const template = useNiftyFiftyTemplate()
  const update = useNiftyFiftyUpdate()
  const {handleSubmit, control, register} = useForm()

  const {login} = template

  const submit = (data: NiftyFifty) => {
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
                    <Grid item xs={12} md={4}>
                      <Box mb={2}>
                        <BackgroundImageUploader
                          label="Logo"
                          property="loginLogo"
                          control={control}
                        />
                      </Box>
                      <Box mb={2}>
                        <Controller
                          name="loginLogoProps.hidden"
                          defaultValue={template.loginLogoProps.hidden}
                          control={control}
                          render={({value, onChange}) => (
                            <Switch
                              checked={value}
                              onChange={onChangeCheckedHandler(onChange)}
                              arial-label="set login logo mode"
                              labelPlacement="end"
                              color="primary"
                              label="Hide Logo"
                            />
                          )}
                        />
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="column"
                        flex="1"
                        mb={2}
                      >
                        <InputLabel>Logo Size</InputLabel>
                        <Controller
                          name="loginLogoProps.size"
                          defaultValue={template.loginLogoProps.size}
                          control={control}
                          render={({value, onChange}) => (
                            <Slider
                              valueLabelDisplay="auto"
                              aria-label="login logo weight"
                              value={value}
                              onChange={handleChangeSlider(onChange)}
                              step={1}
                              min={MIN_LOGO_SIZE_PERCENT}
                              max={MAX_LOGO_SIZE_PERCENT}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box mb={2}>
                        <BackgroundImageUploader
                          label="Left Panel Background"
                          property="loginLogoBackground"
                          control={control}
                        />
                      </Box>
                      <Box mb={2}>
                        <Controller
                          name="loginLogoBackgroundProps.hidden"
                          defaultValue={
                            template.loginLogoBackgroundProps.hidden
                          }
                          control={control}
                          render={({value, onChange}) => (
                            <Switch
                              checked={value}
                              onChange={onChangeCheckedHandler(onChange)}
                              arial-label="set login logo background mode"
                              labelPlacement="end"
                              color="primary"
                              label="Hide Logo background"
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box mb={2}>
                        <BackgroundImageUploader
                          label="Right Panel Background"
                          property="loginBackground"
                          control={control}
                        />
                      </Box>
                      <Box mb={2}>
                        <Controller
                          name="loginBackgroundProps.hidden"
                          defaultValue={template.loginBackgroundProps.hidden}
                          control={control}
                          render={({value, onChange}) => (
                            <Switch
                              checked={value}
                              onChange={onChangeCheckedHandler(onChange)}
                              arial-label="set login background mode"
                              labelPlacement="end"
                              color="primary"
                              label="Hide background"
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Box display="flex" flexDirection="row" flex="2">
                    <Box flex="1" mr={2}>
                      <Controller
                        name="login.logoBackgroundColor"
                        defaultValue={login.logoBackgroundColor}
                        control={control}
                        render={({value, onChange}) => (
                          <ColorPicker
                            label="Logo Background Color"
                            color={value || '#FFFFFF'}
                            onPick={onChange}
                            aria-label="login logo background color"
                          />
                        )}
                      />
                    </Box>
                    <Box flex="1">
                      <InputLabel>Logo Background Opacity</InputLabel>
                      <Controller
                        name="login.logoBackgroundOpacity"
                        defaultValue={login.logoBackgroundOpacity}
                        control={control}
                        render={({value, onChange}) => (
                          <Slider
                            valueLabelDisplay="auto"
                            aria-label="logo background opacity"
                            value={value}
                            valueLabelFormat={(num) => numberFormat(num, 100)}
                            onChange={handleChangeSlider(onChange)}
                            step={0.01}
                            min={0}
                            max={1}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row" flex="2">
                    <Box flex="1" mr={2}>
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
                    </Box>
                    <Box flex="1">
                      <InputLabel>Background Opacity</InputLabel>

                      <Controller
                        name="login.backgroundOpacity"
                        defaultValue={login.backgroundOpacity}
                        control={control}
                        render={({value, onChange}) => (
                          <Slider
                            valueLabelDisplay="auto"
                            aria-label="login background opacity"
                            value={value}
                            valueLabelFormat={(num) => numberFormat(num, 100)}
                            onChange={handleChangeSlider(onChange)}
                            step={0.01}
                            min={0}
                            max={1}
                          />
                        )}
                      />
                    </Box>
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
