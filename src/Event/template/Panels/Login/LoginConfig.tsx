import React, {useEffect, useState} from 'react'
import Switch from '@material-ui/core/Switch'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import ColorPicker from 'lib/ui/ColorPicker'
import {onChangeCheckedHandler, onChangeStringHandler} from 'lib/dom'
import {handleChangeSlider} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import {usePanels} from 'Event/template/Panels'
import {PreviewBox, SectionTitle} from 'organization/Event/GeneralConfig'
import Login from 'Event/auth/Login'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'

const MAX_LOGO_SIZE_PERCENT = 100
const MIN_LOGO_SIZE_PERCENT = 20

export default function LoginFormConfig() {
  const {template, update} = usePanels()
  const {login} = template
  const {event} = useEvent()

  const updateLogin = update.primitive('login')

  const [emailLabel, setEmailLabel] = useState(login.emailLabel)
  const [passwordLabel, setPasswordLabel] = useState(login.passwordLabel)

  const [submitLabel, setSubmitLabel] = useState(login.submitButton.label)
  const [submitBackgroundColor, setSubmitBackgroundColor] = useState(
    login.submitButton.backgroundColor,
  )
  const [submitTextColor, setSubmitTextColor] = useState(
    login.submitButton.textColor,
  )
  const [descriptionText, setDescriptionText] = useState(login.description.text)
  const [descriptionColor, setDescriptionColor] = useState(
    login.description.color,
  )
  const [descriptionFontSize, setDescriptionFontSize] = useState(
    login.description.fontSize,
  )
  const [inputBorderRadius, setInputBorderRadius] = useState(
    login.inputBorderRadius, // spacing[14]
  )
  const [buttonBorderRadius, setButtonBorderRadius] = useState(
    login.submitButton.borderRadius, // spacing[14]
  )
  const [logoHidden, setLogoHidden] = useState<boolean>(
    login.logoHidden || false,
  )
  const [backgroundHidden, setBackgroundHidden] = useState<boolean>(
    login.backgroundHidden || false,
  )

  const [logoSize, setLogoSize] = useState(login.logoSize)

  const [backgroundColor, setBackgroundColor] = useState(login.backgroundColor)
  const [backgroundOpacity, setBackgroundOpacity] = useState(
    login.backgroundOpacity,
  )

  const [submitHoverColor, setSubmitHoverColor] = useState(
    login.submitButton.hoverColor,
  )

  const [forgotPasswordText, setForgotPasswordText] = useState<string>(
    login.passwordReset.linkLabel,
  )
  const [
    forgotPasswordButtonText,
    setForgotPasswordButtonText,
  ] = useState<string>(login.passwordReset.buttonText)
  const [
    forgotPasswordDescription,
    setForgotPasswordDescription,
  ] = useState<string>(login.passwordReset.description)
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string>(
    login.passwordReset.successMessage,
  )

  useEffect(() => {
    const hasChanges =
      login.submitButton.label !== submitLabel ||
      login.submitButton.backgroundColor !== submitBackgroundColor ||
      login.submitButton.textColor !== submitTextColor ||
      login.description.color !== descriptionColor ||
      login.description.fontSize !== descriptionFontSize ||
      login.description.text !== descriptionText ||
      login.logoSize !== logoSize ||
      login.inputBorderRadius !== inputBorderRadius ||
      login.logoHidden !== logoHidden ||
      login.backgroundHidden !== backgroundHidden ||
      login.backgroundColor !== backgroundColor ||
      login.backgroundOpacity !== backgroundOpacity ||
      login.submitButton.hoverColor !== submitHoverColor ||
      login.submitButton.borderRadius !== buttonBorderRadius ||
      login.passwordReset.linkLabel !== forgotPasswordText ||
      login.passwordReset.description !== forgotPasswordDescription ||
      login.passwordReset.buttonText !== forgotPasswordButtonText ||
      login.passwordReset.successMessage !== forgotPasswordMessage ||
      login.emailLabel !== emailLabel ||
      login.passwordLabel !== passwordLabel

    if (!hasChanges) {
      return
    }

    updateLogin({
      submitButton: {
        label: submitLabel,
        backgroundColor: submitBackgroundColor,
        textColor: submitTextColor,
        borderRadius: buttonBorderRadius,
        hoverColor: submitHoverColor,
      },
      description: {
        text: descriptionText,
        color: descriptionColor,
        fontSize: descriptionFontSize,
      },
      passwordReset: {
        linkLabel: forgotPasswordText,
        description: forgotPasswordDescription,
        successMessage: forgotPasswordMessage,
        buttonText: forgotPasswordButtonText,
      },
      backgroundColor,
      backgroundOpacity,
      logoSize,
      inputBorderRadius,
      logoHidden,
      backgroundHidden,
      emailLabel,
      passwordLabel,
    })
  }, [
    login,
    submitLabel,
    submitBackgroundColor,
    submitTextColor,
    descriptionColor,
    descriptionFontSize,
    descriptionText,
    logoSize,
    updateLogin,
    inputBorderRadius,
    logoHidden,
    backgroundHidden,
    buttonBorderRadius,
    backgroundColor,
    backgroundOpacity,
    submitHoverColor,
    forgotPasswordButtonText,
    forgotPasswordDescription,
    forgotPasswordMessage,
    forgotPasswordText,
    emailLabel,
    passwordLabel,
  ])

  return (
    <>
      <SectionTitle>Login</SectionTitle>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
                  <Box display="flex" flexDirection="column" flex="1" mb={2}>
                    <InputLabel>Hide Background</InputLabel>
                    <Switch
                      checked={backgroundHidden}
                      onChange={onChangeCheckedHandler(setBackgroundHidden)}
                      color="primary"
                      inputProps={{
                        'aria-label': 'toggle background visible',
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <EventImageUpload
                    label="Logo"
                    property="login_logo"
                    current={event.login_logo}
                  />
                  <Box display="flex" flexDirection="column" flex="1" mb={2}>
                    <InputLabel>Hide Logo</InputLabel>
                    <Switch
                      checked={logoHidden}
                      onChange={onChangeCheckedHandler(setLogoHidden)}
                      color="primary"
                      inputProps={{
                        'aria-label': 'toggle logo visible',
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box mb={1}>
                <InputLabel>Logo Size</InputLabel>
                <Slider
                  valueLabelDisplay="auto"
                  aria-label="logo weight"
                  value={logoSize}
                  onChange={handleChangeSlider(setLogoSize)}
                  step={1}
                  min={MIN_LOGO_SIZE_PERCENT}
                  max={MAX_LOGO_SIZE_PERCENT}
                />
              </Box>
              <ColorPicker
                label="Background Color"
                color={login.backgroundColor || '#FFFFFF'}
                onPick={setBackgroundColor}
                aria-label="login background color"
              />
              <Box mb={1}>
                <InputLabel>Background Opacity</InputLabel>
                <Slider
                  valueLabelDisplay="auto"
                  aria-label="logo background opacity"
                  value={login.backgroundOpacity || 0}
                  valueLabelFormat={() => (
                    <div>{(login.backgroundOpacity || 0) * 100}</div>
                  )}
                  onChange={handleChangeSlider(setBackgroundOpacity)}
                  step={0.01}
                  min={0}
                  max={1}
                />
              </Box>
              <Box display="flex" flexDirection="row" flex="2">
                <Box mr={1} display="flex" flexDirection="column" flex="1">
                  <TextField
                    label="Email Label"
                    value={emailLabel}
                    onChange={onChangeStringHandler(setEmailLabel)}
                    inputProps={{'aria-label': 'email label'}}
                  />
                </Box>
                <Box ml={1} display="flex" flexDirection="column" flex="1">
                  <TextField
                    label="Password Label"
                    value={passwordLabel}
                    onChange={onChangeStringHandler(setPasswordLabel)}
                    inputProps={{'aria-label': 'password label'}}
                  />
                </Box>
              </Box>
              <TextField
                label="Submit Label"
                value={submitLabel}
                onChange={onChangeStringHandler(setSubmitLabel)}
                inputProps={{'aria-label': 'description text'}}
              />
              <BackgroundPicker
                label="Submit Button Background"
                background={submitBackgroundColor}
                onChange={setSubmitBackgroundColor}
              />
              <BackgroundPicker
                label="Submit Button Hover Background"
                background={submitHoverColor || submitBackgroundColor}
                onChange={setSubmitHoverColor}
              />
              <ColorPicker
                label="Submit Button Color"
                color={submitTextColor}
                onPick={setSubmitTextColor}
                aria-label="submit button color"
              />
              <TextField
                id="description-text"
                label="Description Text"
                defaultValue={descriptionText}
                onChange={onChangeStringHandler(setDescriptionText)}
                inputProps={{'aria-label': 'description text'}}
              />
              <ColorPicker
                label="Description Text Color"
                color={descriptionColor}
                onPick={setDescriptionColor}
                aria-label="description text color"
              />
              <InputLabel>Description Font Size</InputLabel>
              <Slider
                valueLabelDisplay="auto"
                aria-label="description font size"
                value={descriptionFontSize ? descriptionFontSize : 20}
                onChange={handleChangeSlider(setDescriptionFontSize)}
                step={1}
                min={5}
                max={50}
              />
              <InputLabel>Input Border Radius</InputLabel>
              <Slider
                valueLabelDisplay="auto"
                aria-label="input border radius"
                value={inputBorderRadius}
                onChange={handleChangeSlider(setInputBorderRadius)}
                step={1}
                min={0}
                max={60}
              />
              <InputLabel>Button Border Radius</InputLabel>
              <Slider
                valueLabelDisplay="auto"
                aria-label="button border radius"
                value={buttonBorderRadius}
                onChange={handleChangeSlider(setButtonBorderRadius)}
                step={1}
                min={0}
                max={60}
              />
              <TextField
                id="login-label-email"
                label="Email Label"
                defaultValue={emailLabel}
                onChange={onChangeStringHandler(setEmailLabel)}
                inputProps={{'aria-label': 'login email text'}}
              />
              <TextField
                id="login-label-password"
                label="Password Label"
                defaultValue={passwordLabel}
                onChange={onChangeStringHandler(setPasswordLabel)}
                inputProps={{'aria-label': 'login password label'}}
              />
              <TextField
                id="login-forgot-password-text"
                label="Forgot Password Text"
                defaultValue={forgotPasswordText}
                onChange={onChangeStringHandler(setForgotPasswordText)}
                inputProps={{'aria-label': 'login forgot password text'}}
              />
              <TextField
                id="login-forgot-password-button-text"
                label="Forgot Password Button Text"
                defaultValue={forgotPasswordButtonText}
                onChange={onChangeStringHandler(setForgotPasswordButtonText)}
                inputProps={{'aria-label': 'login forgot password button text'}}
              />
              <TextField
                id="login-forgot-password-description"
                label="Forgot Password Description"
                defaultValue={forgotPasswordDescription}
                onChange={onChangeStringHandler(setForgotPasswordDescription)}
                inputProps={{'aria-label': 'login forgot password description'}}
              />
              <TextField
                id="login-forgot-password-message"
                label="Forgot Password Description"
                defaultValue={forgotPasswordMessage}
                onChange={onChangeStringHandler(setForgotPasswordMessage)}
                inputProps={{'aria-label': 'login forgot password message'}}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <PreviewBox>
            <Login isPreview />
          </PreviewBox>
        </Grid>
      </Grid>
    </>
  )
}
