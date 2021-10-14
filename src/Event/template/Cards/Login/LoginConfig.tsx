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
import {useCards} from 'Event/template/Cards'
import {PreviewBox, SectionTitle} from 'organization/Event/GeneralConfig'
import Login from 'Event/auth/Login'
import IconSelect from 'lib/fontawesome/IconSelect'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'

const MAX_LOGO_SIZE_PERCENT = 100
const MIN_LOGO_SIZE_PERCENT = 20

export default function LoginFormConfig() {
  const {template, update} = useCards()
  const {login} = template
  const {event} = useEvent()

  const updateLogin = update.primitive('login')

  const [submitLabel, setSubmitLabel] = useState(login.submitButton.label)
  const [emailLabel, setEmailLabel] = useState(login.emailLabel)
  const [passwordLabel, setPasswordLabel] = useState(login.passwordLabel)
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
    login.inputBorderRadius || 56, // spacing[14]
  )
  const [buttonBorderRadius, setButtonBorderRadius] = useState(
    login.submitButton.borderRadius || 56, // spacing[14]
  )
  const [logoHidden, setLogoHidden] = useState<boolean>(
    login.logoHidden || false,
  )

  const [logoSize, setLogoSize] = useState(login.logoSize)

  const [backgroundColor, setBackgroundColor] = useState(login.backgroundColor)
  const [backgroundOpacity, setBackgroundOpacity] = useState(
    login.backgroundOpacity,
  )

  const [submitHoverColor, setSubmitHoverColor] = useState(
    login.submitButton.hoverColor,
  )

  const [passwordResetLinkLabel, setPasswordResetLinkLabel] = useState<string>(
    login.passwordReset.linkLabel,
  )
  const [
    passwordResetButtonText,
    setPasswordResetButtonText,
  ] = useState<string>(login.passwordReset.buttonText)
  const [
    passwordResetDescription,
    setPasswordResetDescription,
  ] = useState<string>(login.passwordReset.description)
  const [
    passwordResetSuccessMessage,
    setPasswordResetSuccessMessage,
  ] = useState<string>(login.passwordReset.successMessage)
  const [
    passwordResetForgotPasswordTitle,
    setPasswordResetForgotPasswordTitle,
  ] = useState<string>(login.passwordReset.forgotPasswordTitle)

  const [welcomeText, setWelcomeText] = useState(login.welcome.text)
  const [welcomeColor, setWelcomeColor] = useState(login.welcome.color)
  const [welcomeFontSize, setWelcomeFontSize] = useState(login.welcome.fontSize)
  const [iconName, setIconName] = useState<string | null>(
    login.passwordReset.iconName,
  )
  const [iconColor, setIconColor] = useState<string>(
    login.passwordReset.iconColor,
  )

  const [additionalDescriptionText, setAdditionalDescriptionText] = useState(
    login.additional_description.text,
  )
  const [additionalDescriptionColor, setAdditionalDescriptionColor] = useState(
    login.additional_description.color,
  )
  const [
    additionalDescriptionFontSize,
    setAdditionalDescriptionFontSize,
  ] = useState(login.additional_description.fontSize)

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
      login.backgroundColor !== backgroundColor ||
      login.backgroundOpacity !== backgroundOpacity ||
      login.submitButton.hoverColor !== submitHoverColor ||
      login.submitButton.borderRadius !== buttonBorderRadius ||
      login.passwordReset?.linkLabel !== passwordResetLinkLabel ||
      login.passwordReset?.description !== passwordResetDescription ||
      login.passwordReset?.buttonText !== passwordResetButtonText ||
      login.passwordReset?.successMessage !== passwordResetSuccessMessage ||
      login.passwordReset?.forgotPasswordTitle !==
        passwordResetForgotPasswordTitle ||
      login.emailLabel !== emailLabel ||
      login.passwordLabel !== passwordLabel ||
      login.welcome.text !== welcomeText ||
      login.welcome.color !== welcomeColor ||
      login.welcome.fontSize !== welcomeFontSize ||
      login.passwordReset.iconName !== iconName ||
      login.passwordReset.iconColor !== iconColor ||
      login.additional_description.fontSize !== additionalDescriptionFontSize ||
      login.additional_description.color !== additionalDescriptionColor ||
      login.additional_description.text !== additionalDescriptionText

    if (!hasChanges) {
      return
    }

    updateLogin({
      emailLabel: emailLabel,
      passwordLabel: passwordLabel,
      submitButton: {
        label: submitLabel,
        backgroundColor: submitBackgroundColor,
        textColor: submitTextColor,
        borderRadius: buttonBorderRadius,
        hoverColor: submitHoverColor,
      },
      welcome: {
        text: welcomeText,
        color: welcomeColor,
        fontSize: welcomeFontSize,
      },
      description: {
        text: descriptionText,
        color: descriptionColor,
        fontSize: descriptionFontSize,
      },
      additional_description: {
        text: additionalDescriptionText,
        fontSize: additionalDescriptionFontSize,
        color: additionalDescriptionColor,
      },
      passwordReset: {
        iconName: iconName,
        iconColor: iconColor,
        linkLabel: passwordResetLinkLabel,
        description: passwordResetDescription,
        successMessage: passwordResetSuccessMessage,
        buttonText: passwordResetButtonText,
        forgotPasswordTitle: passwordResetForgotPasswordTitle,
      },
      backgroundColor,
      backgroundOpacity,
      logoSize,
      inputBorderRadius,
      logoHidden: logoHidden,
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
    buttonBorderRadius,
    backgroundColor,
    backgroundOpacity,
    submitHoverColor,
    passwordResetButtonText,
    passwordResetForgotPasswordTitle,
    passwordResetDescription,
    passwordResetSuccessMessage,
    passwordResetLinkLabel,
    emailLabel,
    passwordLabel,
    welcomeText,
    welcomeColor,
    welcomeFontSize,
    iconName,
    iconColor,
    additionalDescriptionFontSize,
    additionalDescriptionColor,
    additionalDescriptionText,
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
                inputProps={{'aria-label': 'submit button text'}}
              />
              <BackgroundPicker
                label="Submit Button Background"
                background={submitBackgroundColor}
                onChange={setSubmitBackgroundColor}
              />
              <ColorPicker
                label="Submit Button Color"
                color={submitTextColor}
                onPick={setSubmitTextColor}
                aria-label="submit button color"
              />
              <BackgroundPicker
                label="Submit Button Hover Background"
                background={submitHoverColor || submitBackgroundColor}
                onChange={setSubmitHoverColor}
              />
              <TextField
                label="Welcome Text"
                defaultValue={welcomeText}
                onChange={onChangeStringHandler(setWelcomeText)}
                inputProps={{'aria-label': 'welcome text'}}
              />
              <ColorPicker
                label="Welcome Text Color"
                color={welcomeColor}
                onPick={setWelcomeColor}
                aria-label="welcome text color"
              />
              <InputLabel>Welcome Text Font Size</InputLabel>
              <Slider
                valueLabelDisplay="auto"
                aria-label="welcome font size"
                value={welcomeFontSize}
                onChange={handleChangeSlider(setWelcomeFontSize)}
                step={1}
                min={5}
                max={50}
              />
              <TextField
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
                value={descriptionFontSize}
                onChange={handleChangeSlider(setDescriptionFontSize)}
                step={1}
                min={5}
                max={50}
              />

              <TextField
                label="Additional Description Text"
                defaultValue={additionalDescriptionText}
                onChange={onChangeStringHandler(setAdditionalDescriptionText)}
                inputProps={{'aria-label': 'additional description text'}}
              />
              <ColorPicker
                label="Additional Description Text Color"
                color={additionalDescriptionColor}
                onPick={setAdditionalDescriptionColor}
                aria-label="additional description text color"
              />
              <InputLabel>Additional Description Font Size</InputLabel>
              <Slider
                valueLabelDisplay="auto"
                aria-label="description font size"
                value={additionalDescriptionFontSize}
                onChange={handleChangeSlider(setAdditionalDescriptionFontSize)}
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <IconSelect value={iconName} onChange={setIconName} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <ColorPicker
                    label="Ion Color"
                    color={iconColor}
                    onPick={setIconColor}
                    aria-label="login forgot password icon color"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Forgot Password Text"
                    defaultValue={passwordResetLinkLabel}
                    onChange={onChangeStringHandler(setPasswordResetLinkLabel)}
                    inputProps={{'aria-label': 'login forgot password text'}}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <TextField
                id="login-forgot-password-title"
                label="Forgot Password Title Text"
                defaultValue={passwordResetForgotPasswordTitle}
                onChange={onChangeStringHandler(
                  setPasswordResetForgotPasswordTitle,
                )}
                inputProps={{'aria-label': 'login forgot password title text'}}
              />
              <TextField
                id="login-forgot-password-description"
                label="Forgot Password Description"
                defaultValue={passwordResetDescription}
                onChange={onChangeStringHandler(setPasswordResetDescription)}
                inputProps={{'aria-label': 'login forgot password description'}}
              />
              <TextField
                id="login-forgot-password-message"
                label="Forgot Password Message"
                defaultValue={passwordResetSuccessMessage}
                onChange={onChangeStringHandler(setPasswordResetSuccessMessage)}
                inputProps={{'aria-label': 'login forgot password message'}}
              />
              <TextField
                id="login-forgot-password-button-text"
                label="Forgot Password Button Text"
                defaultValue={passwordResetButtonText}
                onChange={onChangeStringHandler(setPasswordResetButtonText)}
                inputProps={{'aria-label': 'login forgot password button text'}}
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
