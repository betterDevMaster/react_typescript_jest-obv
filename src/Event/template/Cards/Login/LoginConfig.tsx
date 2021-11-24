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
import {Cards, useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import {PreviewBox, SectionTitle} from 'organization/Event/Page'
import Login from 'Event/auth/Login'
import IconSelect from 'lib/fontawesome/IconSelect'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import {Controller, useForm} from 'react-hook-form'
import Button from '@material-ui/core/Button'

const MAX_LOGO_SIZE_PERCENT = 100
const MIN_LOGO_SIZE_PERCENT = 20

export default function LoginFormConfig() {
  const template = useCardsTemplate()
  const updateTemplate = useCardsUpdate()
  const {login} = template
  const {event} = useEvent()
  const {handleSubmit, control, register} = useForm()

  const submit = (data: Cards['login']) => {
    updateTemplate({login: data})
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
                          name="logoHidden"
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
                      name="logoSize"
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
                    name="backgroundColor"
                    defaultValue={login.backgroundColor}
                    control={control}
                    render={({value, onChange}) => (
                      <ColorPicker
                        label="Background Color"
                        color={value}
                        onPick={onChange}
                        aria-label="login background color"
                      />
                    )}
                  />
                  <Box mb={1}>
                    <InputLabel>Background Opacity</InputLabel>
                    <Controller
                      name="backgroundOpacity"
                      defaultValue={login.backgroundOpacity}
                      control={control}
                      render={({value, onChange}) => (
                        <Slider
                          valueLabelDisplay="auto"
                          aria-label="logo background opacity"
                          value={value}
                          valueLabelFormat={() => <div>{value * 100}</div>}
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
                        name="emailLabel"
                        defaultValue={login.emailLabel}
                        label="Email Label"
                        inputProps={{
                          'aria-label': 'email label',
                          ref: register,
                        }}
                      />
                    </Box>
                    <Box ml={1} display="flex" flexDirection="column" flex="1">
                      <TextField
                        label="Password Label"
                        name="passwordLabel"
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
                    name="submitButton.label"
                    defaultValue={login.submitButton.label}
                    inputProps={{
                      'aria-label': 'description text',
                      ref: register,
                    }}
                  />
                  <Controller
                    name="submitButton.backgroundColor"
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
                    name="submitButton.textColor"
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
                  <Controller
                    name="submitButton.hoverColor"
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
                  <TextField
                    label="Submit Label"
                    name="submitButton.label"
                    defaultValue={login.submitButton.label}
                    inputProps={{
                      'aria-label': 'description text',
                      ref: register,
                    }}
                  />
                  <TextField
                    label="Welcome Text"
                    name="welcome.text"
                    defaultValue={login.welcome.text}
                    inputProps={{
                      'aria-label': 'welcome text',
                      ref: register,
                    }}
                  />
                  <Controller
                    name="welcome.color"
                    defaultValue={login.welcome.color}
                    control={control}
                    render={({value, onChange}) => (
                      <ColorPicker
                        label="Welcome Text Color"
                        color={value}
                        onPick={onChange}
                        aria-label="welcome text color"
                      />
                    )}
                  />
                  <InputLabel>Welcome Text Font Size</InputLabel>
                  <Controller
                    name="welcome.fontSize"
                    defaultValue={login.welcome.fontSize}
                    control={control}
                    render={({value, onChange}) => (
                      <Slider
                        valueLabelDisplay="auto"
                        aria-label="welcome font size"
                        value={value}
                        onChange={handleChangeSlider(onChange)}
                        step={1}
                        min={5}
                        max={50}
                      />
                    )}
                  />
                  <TextField
                    label="Description Text"
                    name="description.text"
                    defaultValue={login.description.text}
                    inputProps={{
                      'aria-label': 'description text',
                      ref: register,
                    }}
                  />
                  <Controller
                    name="description.color"
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
                    name="description.fontSize"
                    defaultValue={login.description.fontSize}
                    control={control}
                    render={({value, onChange}) => (
                      <Slider
                        valueLabelDisplay="auto"
                        aria-label="description font size"
                        value={value}
                        onChange={handleChangeSlider(onChange)}
                        step={1}
                        min={5}
                        max={50}
                      />
                    )}
                  />

                  <TextField
                    label="Additional Description Text"
                    name="additional_description.text"
                    defaultValue={login.additional_description.text}
                    inputProps={{
                      'aria-label': 'additional description text',
                      ref: register,
                    }}
                  />
                  <Controller
                    name="additional_description.color"
                    defaultValue={login.additional_description.color}
                    control={control}
                    render={({value, onChange}) => (
                      <ColorPicker
                        label="Additional Description Text Color"
                        color={value}
                        onPick={onChange}
                        aria-label="additional description text color"
                      />
                    )}
                  />
                  <InputLabel>Additional Description Font Size</InputLabel>
                  <Controller
                    name="additional_description.fontSize"
                    defaultValue={login.additional_description.fontSize}
                    control={control}
                    render={({value, onChange}) => (
                      <Slider
                        valueLabelDisplay="auto"
                        aria-label="description font size"
                        value={value}
                        onChange={handleChangeSlider(onChange)}
                        step={1}
                        min={5}
                        max={50}
                      />
                    )}
                  />

                  <InputLabel>Input Border Radius</InputLabel>
                  <Controller
                    name="inputBorderRadius"
                    defaultValue={login.description.fontSize}
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
                    name="submitButton.borderRadius"
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
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="passwordReset.iconName"
                        defaultValue={login.passwordReset.iconName}
                        control={control}
                        render={({value, onChange}) => (
                          <IconSelect value={value} onChange={onChange} />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="passwordReset.iconColor"
                        defaultValue={login.passwordReset.iconColor}
                        control={control}
                        render={({value, onChange}) => (
                          <ColorPicker
                            label="Icon Color"
                            color={value}
                            onPick={onChange}
                            aria-label="login forgot password icon color"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="passwordReset.linkLabel"
                        defaultValue={login.passwordReset.linkLabel}
                        label="Forgot Password Text"
                        inputProps={{
                          'aria-label': 'login forgot password text',
                          ref: register,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    name="passwordReset.forgotPasswordTitle"
                    defaultValue={login.passwordReset.forgotPasswordTitle}
                    label="Forgot Password Title Text"
                    inputProps={{
                      'aria-label': 'login forgot password title text',
                      ref: register,
                    }}
                  />
                  <TextField
                    name="passwordReset.description"
                    defaultValue={login.passwordReset.description}
                    label="Forgot Password Description"
                    inputProps={{
                      'aria-label': 'login forgot password description',
                      ref: register,
                    }}
                  />
                  <TextField
                    name="passwordReset.successMessage"
                    label="Forgot Password Message"
                    defaultValue={login.passwordReset.successMessage}
                    inputProps={{
                      'aria-label': 'login forgot password message',
                      ref: register,
                    }}
                  />
                  <TextField
                    name="passwordReset.buttonText"
                    label="Forgot Password Button Text"
                    defaultValue={login.passwordReset.buttonText}
                    inputProps={{
                      'aria-label': 'login forgot password button text',
                      ref: register,
                    }}
                  />
                </Box>
              </Box>
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
              <Login isPreview />
            </PreviewBox>
          </Grid>
        </Grid>
      </Page>
    </Layout>
  )
}
