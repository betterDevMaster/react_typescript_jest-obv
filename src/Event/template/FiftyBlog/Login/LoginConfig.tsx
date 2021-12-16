import React from 'react'
import {Controller, useForm} from 'react-hook-form'

import {
  Box,
  Button,
  Grid,
  InputLabel,
  Slider,
  Switch,
  TextField,
} from '@material-ui/core'

import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'

import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {PreviewBox, SectionTitle} from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'

import {useEvent} from 'Event/EventProvider'
import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'
import Login from 'Event/auth/Login'

const MAX_LOGO_SIZE_PERCENT = 100
const MIN_LOGO_SIZE_PERCENT = 20

export default function LoginFormConfig() {
  const template = useFiftyBlogTemplate()
  const update = useFiftyBlogUpdate()
  const {handleSubmit, control, register} = useForm()

  const {login} = template
  const {event} = useEvent()

  const submit = (data: FiftyBlog) => {
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
                    <Grid item xs={12} md={6}>
                      <EventImageUpload
                        label="Logo Background"
                        property="login_logo_background"
                        current={event.login_logo_background}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        flex="1"
                        mb={2}
                      >
                        <InputLabel>Hide Logo Background</InputLabel>

                        <Controller
                          name="login.logoBackgroundHidden"
                          defaultValue={login.logoBackgroundHidden}
                          control={control}
                          render={({value, onChange}) => (
                            <Switch
                              checked={value}
                              onChange={onChangeCheckedHandler(onChange)}
                              color="primary"
                              inputProps={{
                                'aria-label': 'toggle logo backgournd visible',
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <EventImageUpload
                        label="Content Background"
                        property="login_content_background"
                        current={event.login_content_background}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        flex="1"
                        mb={2}
                      >
                        <InputLabel>Hide Content Background</InputLabel>

                        <Controller
                          name="login.logoContentBackgroundHidden"
                          defaultValue={login.logoContentBackgroundHidden}
                          control={control}
                          render={({value, onChange}) => (
                            <Switch
                              checked={value}
                              onChange={onChangeCheckedHandler(onChange)}
                              color="primary"
                              inputProps={{
                                'aria-label':
                                  'toggle content backgournd visible',
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
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
                    </Grid>
                    <Grid item xs={12} md={4}>
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
                                <div>
                                  {(login.backgroundOpacity || 0) * 100}
                                </div>
                              )}
                              onChange={handleChangeSlider(onChange)}
                              step={0.01}
                              min={0}
                              max={1}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
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
                    </Grid>
                  </Grid>
                  <Box display="flex" flexDirection="row" flex="4">
                    <Box mr={1} display="flex" flexDirection="column" flex="2">
                      <TextField
                        label="Welcome Label"
                        name="login.welcome.text"
                        defaultValue={login.welcome.text}
                        fullWidth
                        inputProps={{
                          'aria-label': 'welcome label',
                          ref: register,
                        }}
                      />
                    </Box>
                    <Box mr={1} display="flex" flexDirection="column" flex="1">
                      <Controller
                        name="login.welcome.color"
                        defaultValue={login.welcome.color}
                        control={control}
                        render={({value, onChange}) => (
                          <ColorPicker
                            label="Welcome Text Color"
                            color={value || '#000000'}
                            onPick={onChange}
                            aria-label="login welcome color"
                          />
                        )}
                      />
                    </Box>
                    <Box ml={1} display="flex" flexDirection="column" flex="1">
                      <InputLabel>Welcome Font Size</InputLabel>
                      <Controller
                        name="login.welcome.fontSize"
                        defaultValue={login.welcome.fontSize}
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
                    </Box>
                  </Box>

                  <Box display="flex" flexDirection="row" flex="2">
                    <Box mr={1} display="flex" flexDirection="column" flex="1">
                      <TextField
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
                  <Box display="flex" flexDirection="row" flex="2">
                    <Box mr={1} display="flex" flexDirection="column" flex="1">
                      <TextField
                        label="Submit Label"
                        name="login.submitButton.label"
                        defaultValue={login.submitButton.label}
                        inputProps={{
                          'aria-label': 'description text',
                          ref: register,
                        }}
                      />
                    </Box>
                    <Box ml={1} display="flex" flexDirection="column" flex="1">
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
                    </Box>
                  </Box>

                  <Box display="flex" flexDirection="row" flex="3">
                    <Box mr={1} display="flex" flexDirection="column" flex="1">
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
                    </Box>
                    <Box ml={1} display="flex" flexDirection="column" flex="1">
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
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row" flex="2">
                    <Box mr={1} display="flex" flexDirection="column" flex="1">
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
                    </Box>
                    <Box ml={1} display="flex" flexDirection="column" flex="1">
                      <InputLabel>Submit Button Border Radius</InputLabel>
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
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row" flex="4">
                    <Box mr={1} display="flex" flexDirection="column" flex="2">
                      <TextField
                        label="Forgot Password Link Text"
                        name="login.passwordReset.linkLabel"
                        defaultValue={login.passwordReset.linkLabel}
                        inputProps={{
                          'aria-label': 'login forgot password text',
                          ref: register,
                        }}
                      />
                    </Box>
                    <Box mr={1} display="flex" flexDirection="column" flex="1">
                      <TextField
                        label="Forgot Password Link Url"
                        name="login.passwordReset.linkUrl"
                        defaultValue={login.passwordReset.linkUrl}
                        inputProps={{
                          'aria-label': 'login forgot password button text',
                          ref: register,
                        }}
                      />
                    </Box>
                    <Box ml={1} display="flex" flexDirection="column" flex="1">
                      <Controller
                        name="login.passwordReset.color"
                        defaultValue={login.passwordReset.color}
                        control={control}
                        render={({value, onChange}) => (
                          <ColorPicker
                            label="Forgot Text Color"
                            color={value || '#FFFFFF'}
                            onPick={onChange}
                            aria-label="login forgot password text color"
                          />
                        )}
                      />
                    </Box>
                  </Box>
                  <TextField
                    label="Forgot Password Description"
                    name="login.passwordReset.description"
                    defaultValue={login.passwordReset.description}
                    inputProps={{
                      'aria-label': 'login forgot password description',
                      ref: register,
                    }}
                  />
                  <TextField
                    label="Forgot Password Success Text"
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
