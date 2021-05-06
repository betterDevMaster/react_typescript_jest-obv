import {Container} from '@material-ui/core'
import styled from 'styled-components'
import React from 'react'
import Typography from '@material-ui/core/Typography/'
import TextField from '@material-ui/core/TextField'
import {useForm} from 'react-hook-form'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {SetPasswordFormProps} from 'Event/Step1/SetPasswordForm'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import ProgressBar from 'lib/ui/ProgressBar'
import {useTemplate} from 'Event/TemplateProvider'
import {
  DEFAULT_BUTTON_BACKGROUND_COLOR,
  DEFAULT_BUTTON_BORDER_RADIUS,
  DEFAULT_BUTTON_TEXT,
  DEFAULT_BUTTON_TEXT_COLOR,
  DEFAULT_CONFIRM_PASSWORD_LABEL,
  DEFAULT_PASSWORD_LABEL,
  DEFAULT_TITLE,
} from 'Event/template/SimpleBlog/SetPasswordForm/SetPasswordFormConfig'
import MuiButton from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import {useWithVariables} from 'Event'

export default function SimpleBlogSetPasswordForm(props: SetPasswordFormProps) {
  const {register, handleSubmit, errors, watch} = useForm()
  const template = useTemplate()
  const v = useWithVariables()

  const {setPasswordForm} = template

  const password = watch('password')

  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="sm">
        <ProgressBar
          value={props.progress}
          barColor={template.progressBar.barColor}
          textColor={template.progressBar.textColor}
          borderRadius={template.progressBar.borderRadius}
          thickness={template.progressBar.thickness}
        />
        <Typography align="center" variant="h6">
          {v(setPasswordForm?.title || DEFAULT_TITLE)}
        </Typography>
        <Description>{v(setPasswordForm?.description || '')}</Description>
        <Box mt={2}>
          <form onSubmit={handleSubmit(props.submit)}>
            <TextField
              label={setPasswordForm?.passwordLabel || DEFAULT_PASSWORD_LABEL}
              type="password"
              fullWidth
              variant="outlined"
              name="password"
              inputProps={{
                ref: register({
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                }),
                'aria-label': 'password input',
              }}
              error={!!errors.password}
              helperText={errors.password && errors.password.message}
              disabled={props.submitting}
            />
            <TextField
              label={
                setPasswordForm?.confirmPasswordLabel ||
                DEFAULT_CONFIRM_PASSWORD_LABEL
              }
              type="password"
              fullWidth
              variant="outlined"
              name="password_confirmation"
              inputProps={{
                ref: register({
                  required: 'Confirm Password is required',
                  validate: (value: any) =>
                    value === password || 'Passwords are not a match',
                }),
                'aria-label': 'confirm password input',
              }}
              error={!!errors.password_confirmation}
              helperText={
                errors.password_confirmation &&
                errors.password_confirmation.message
              }
              disabled={props.submitting}
            />
            <Error>{props.responseError && props.responseError.message}</Error>

            <StyledButton
              variant="contained"
              fullWidth
              type="submit"
              backgroundColor={
                setPasswordForm?.button?.backgroundColor ||
                DEFAULT_BUTTON_BACKGROUND_COLOR
              }
              hoverColor={
                setPasswordForm?.button?.hoverBackgroundColor ||
                DEFAULT_BUTTON_BACKGROUND_COLOR
              }
              color={
                setPasswordForm?.button?.textColor || DEFAULT_BUTTON_TEXT_COLOR
              }
              borderRadius={
                setPasswordForm?.button?.borderRadius ||
                DEFAULT_BUTTON_BORDER_RADIUS
              }
              aria-label="submit set password form"
            >
              {setPasswordForm?.button?.text || DEFAULT_BUTTON_TEXT}
            </StyledButton>
          </form>
        </Box>
      </Container>
    </SimpleBlogPage>
  )
}
function Description(props: {children?: string}) {
  if (!props.children) {
    return null
  }

  return <Typography align="center">{props.children}</Typography>
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)

export const StyledButton = styled(
  ({color, backgroundColor, borderRadius, hoverColor, ...otherProps}) => (
    <MuiButton {...otherProps} />
  ),
)`
  border-radius: ${(props) => props.borderRadius}px !important;
  height: 50px;
  color: ${(props) => props.color} !important;
  background-color: ${(props) => props.backgroundColor} !important;

  &:hover {
    background-color: ${(props) => props.hoverColor} !important;
  }
`
