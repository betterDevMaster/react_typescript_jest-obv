import Container from '@material-ui/core/Container'
import styled from 'styled-components'
import React from 'react'
import Typography from '@material-ui/core/Typography/'
import {useForm} from 'react-hook-form'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {SetPasswordFormProps} from 'Event/Step1/SetPasswordForm'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import ProgressBar from 'lib/ui/ProgressBar'
import MuiButton from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import {useAttendeeVariables} from 'Event'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import TextField from 'Event/ui/TextField'

export default function SetPasswordForm(props: SetPasswordFormProps) {
  const {register, handleSubmit, errors, watch} = useForm()
  const template = useSimpleBlogTemplate()
  const v = useAttendeeVariables()

  const {setPasswordForm} = template

  const password = watch('password')

  return (
    <SimpleBlogPage user={props.user}>
      <Container maxWidth="sm">
        <ProgressBar
          showing={template.progressBar.showing}
          text={template.progressBar.step1Text}
          value={template.progressBar.step1Percent}
          barColor={template.progressBar.barColor}
          backgroundColor={template.progressBar.backgroundColor}
          textColor={template.progressBar.textColor}
          borderRadius={template.progressBar.borderRadius}
          thickness={template.progressBar.thickness}
        />
        <Typography align="center" variant="h6">
          {v(setPasswordForm.title)}
        </Typography>
        <Description>{v(setPasswordForm?.description || '')}</Description>
        <Box mt={2}>
          <form onSubmit={handleSubmit(props.submit)}>
            <TextField
              label={v(setPasswordForm.passwordLabel)}
              type="password"
              fullWidth
              borderRadius={setPasswordForm.inputBorderRadius}
              name="password"
              variant="filled"
              InputProps={{disableUnderline: true}}
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
              label={v(setPasswordForm.confirmPasswordLabel)}
              type="password"
              fullWidth
              name="password_confirmation"
              borderRadius={setPasswordForm.inputBorderRadius}
              variant="filled"
              InputProps={{disableUnderline: true}}
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
              backgroundColor={setPasswordForm.button.backgroundColor}
              hoverColor={setPasswordForm.button.hoverBackgroundColor}
              color={setPasswordForm.button.textColor}
              borderRadius={setPasswordForm.button.borderRadius}
              aria-label="submit set password form"
            >
              {v(setPasswordForm.button.text)}
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
  ({
    color: _1,
    backgroundColor: _2,
    borderRadius: _3,
    hoverColor: _4,
    ...otherProps
  }) => <MuiButton {...otherProps} />,
)`
  border-radius: ${(props) => props.borderRadius}px !important;
  height: 50px;
  color: ${(props) => props.color} !important;
  background: ${(props) => props.backgroundColor} !important;

  &:hover {
    background: ${(props) => props.hoverColor} !important;
  }
`
