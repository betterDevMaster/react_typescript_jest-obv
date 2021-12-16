import React from 'react'
import styled from 'styled-components'

import {makeStyles} from '@material-ui/core/styles'
import {
  Grid,
  InputAdornment,
  Link,
  OutlinedInput,
  TextField,
  Typography,
} from '@material-ui/core'
import MuiButton from '@material-ui/core/Button'

import {useEvent} from 'Event/EventProvider'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {useGuestVariables} from 'Event'

import defaultContentBackground from 'assets/images/background.png'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '6px',
    marginBottom: '6px',
  },
}))

export default function Content() {
  const template = useFiftyBlogTemplate()
  const {login} = template
  const {event} = useEvent()
  const classes = useStyles()
  const v = useGuestVariables()

  const welcomeLabel = v(template.login.welcome.text)
  const emailLabel = v(login.emailLabel)
  const passwordLabel = v(login.passwordLabel)

  const background = event.login_content_background
    ? event.login_content_background.url
    : defaultContentBackground

  return (
    <Box
      background={background}
      isBoxHidden={login.logoContentBackgroundHidden}
    >
      <Typography
        className="whitespace-pre-line text-center mb-4 f-weight-700"
        style={{color: login.welcome.color, fontSize: login.welcome.fontSize}}
      >
        {welcomeLabel}
      </Typography>
      <OutlinedInput
        name="emailLabel"
        className={classes.root}
        fullWidth
        placeholder={emailLabel}
        aria-describedby="login-email-content"
        style={{
          borderRadius: login.inputBorderRadius,
        }}
        inputProps={{
          'aria-label': 'email',
        }}
      />
      <OutlinedInput
        name="passwordLabel"
        className={classes.root}
        fullWidth
        placeholder={passwordLabel}
        aria-describedby="login-password-content"
        style={{
          borderRadius: login.inputBorderRadius,
        }}
        inputProps={{
          'aria-label': 'password',
        }}
      />
      <Grid item xs className="text-right mb-8">
        <Link
          href="#"
          variant="body2"
          aria-label="forgot password"
          style={{
            color: login.passwordReset.color,
          }}
        >
          {login.passwordReset.linkLabel}
        </Link>
      </Grid>
      <StyledButton
        variant="contained"
        fullWidth
        type="submit"
        aria-label="submit login"
        color={login.submitButton.textColor}
        borderRadius={login.submitButton.borderRadius}
        backgroundColor={login.submitButton.backgroundColor}
        hoverColor={login.submitButton.hoverColor}
      >
        {login.submitButton.label || ''}
      </StyledButton>
    </Box>
  )
}

export const Box = styled.div<{
  background: string
  isBoxHidden?: boolean
}>`
  ${(props) =>
    props.isBoxHidden
      ? 'background: transparent;'
      : `background: url(${props.background});`}
  width: 100%;
  text-align: center;
  padding: ${(props) => props.theme.spacing[20]};
`

export const StyledButton = styled(
  ({color, backgroundColor, borderRadius, hoverColor, ...otherProps}) => (
    <MuiButton {...otherProps} />
  ),
)`
  border-radius: ${(props) => props.borderRadius}px !important;
  height: 50px;
  color: ${(props) => props.color} !important;
  background: ${(props) => props.backgroundColor} !important;

  &:hover {
    background: ${(props) => props.hoverColor} !important;
  }
`
