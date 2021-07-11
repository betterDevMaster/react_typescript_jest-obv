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
import {Panels, usePanels} from 'Event/template/Panels'
import {PreviewBox, SectionTitle} from 'organization/Event/GeneralConfig'
import Login from 'Event/auth/Login'
import {
  DEFAULT_EMAIL_LABEL,
  DEFAULT_PASSWORD_LABEL,
} from 'Event/template/Panels/Login'

const MAX_LOGO_SIZE_PERCENT = 100
const MIN_LOGO_SIZE_PERCENT = 20

export const DEFAULT_LOGIN_CONFIG: NonNullable<Panels['login']> = {
  submitButton: {
    backgroundColor: '#FFFFFF',
    textColor: '#FFFFFF',
    label: 'Login',
    borderRadius: 56,
    hoverColor: '#FFFFFF',
  },
  description: {
    text: '',
    color: '#000000',
    fontSize: 18,
  },
  backgroundColor: '#FFFFFF',
  backgroundOpacity: 0,
  logoSize: 20,
  inputBorderRadius: 56,
  logoHidden: false,
  backgroundHidden: false,
  emailLabel: DEFAULT_EMAIL_LABEL,
  passwordLabel: DEFAULT_PASSWORD_LABEL,
}

export const DEFAULT_LOGO_SIZE_PERCENT = 20

export default function LoginFormConfig() {
  const {template, update} = usePanels()
  const {login: templateLogin} = template
  const {event} = useEvent()

  const login = templateLogin ? templateLogin : DEFAULT_LOGIN_CONFIG
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
    login.inputBorderRadius || 56, // spacing[14]
  )
  const [buttonBorderRadius, setButtonBorderRadius] = useState(
    login.submitButton.borderRadius || 56, // spacing[14]
  )
  const [logoHidden, setLogoHidden] = useState<boolean>(
    login.logoHidden || false,
  )
  const [backgroundHidden, setBackgroundHidden] = useState<boolean>(
    login.backgroundHidden || false,
  )

  const [logoSize, setLogoSize] = useState(
    login.logoSize || DEFAULT_LOGO_SIZE_PERCENT,
  )

  const [backgroundColor, setBackgroundColor] = useState(login.backgroundColor)
  const [backgroundOpacity, setBackgroundOpacity] = useState(
    login.backgroundOpacity,
  )

  const [submitHoverColor, setSubmitHoverColor] = useState(
    login.submitButton.hoverColor,
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
      backgroundColor,
      backgroundOpacity,
      logoSize,
      inputBorderRadius,
      logoHidden: logoHidden,
      backgroundHidden: backgroundHidden,
      emailLabel: emailLabel,
      passwordLabel: passwordLabel,
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
                  value={logoSize ? logoSize : DEFAULT_LOGO_SIZE_PERCENT}
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
              <ColorPicker
                label="Submit Button Background Color"
                color={submitBackgroundColor}
                onPick={setSubmitBackgroundColor}
                aria-label="submit button background color"
              />
              <ColorPicker
                label="Submit Button Color"
                color={submitTextColor}
                onPick={setSubmitTextColor}
                aria-label="submit button color"
              />
              <ColorPicker
                label="Submit Button Hover Color"
                color={submitHoverColor || submitBackgroundColor}
                onPick={setSubmitHoverColor}
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