import styled from 'styled-components'
import React from 'react'
import Typography from '@material-ui/core/Typography/'
import TextField from '@material-ui/core/TextField'
import {useForm} from 'react-hook-form'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {SetPasswordFormProps} from 'Event/Step1/SetPasswordForm'
import {
  DEFAULT_BUTTON_BACKGROUND_COLOR,
  DEFAULT_BUTTON_BORDER_RADIUS,
  DEFAULT_BUTTON_TEXT,
  DEFAULT_BUTTON_TEXT_COLOR,
  DEFAULT_CONFIRM_PASSWORD_LABEL,
  DEFAULT_PASSWORD_LABEL,
  DEFAULT_TITLE,
} from 'Event/template/Panels/Step1/SetPasswordFormConfig'
import MuiButton from '@material-ui/core/Button'
import {useVariables} from 'Event'
import {usePanels} from 'Event/template/Panels'
import {withDefault} from 'lib/template'

export default function Content(props: SetPasswordFormProps) {
  const {register, handleSubmit, errors, watch} = useForm()
  const {template} = usePanels()
  const v = useVariables()

  const {setPasswordForm} = template

  const password = watch('password')

  return (
    <>
      <div>
        <Title align="center" variant="h3">
          {v(withDefault(DEFAULT_TITLE, setPasswordForm?.title))}
        </Title>
        <Description>{v(setPasswordForm?.description || '')}</Description>
        <form onSubmit={handleSubmit(props.submit)}>
          <TextField
            label={v(setPasswordForm?.passwordLabel || DEFAULT_PASSWORD_LABEL)}
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
            label={v(
              setPasswordForm?.confirmPasswordLabel ||
                DEFAULT_CONFIRM_PASSWORD_LABEL,
            )}
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
            borderRadius={withDefault(
              DEFAULT_BUTTON_BORDER_RADIUS,
              setPasswordForm?.button?.borderRadius,
            )}
            aria-label="submit set password form"
          >
            {v(withDefault(DEFAULT_BUTTON_TEXT, setPasswordForm?.button?.text))}
          </StyledButton>
        </form>
      </div>
    </>
  )
}

function Description(props: {children?: string}) {
  if (!props.children) {
    return null
  }

  return <DescriptionText align="center">{props.children}</DescriptionText>
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

const Title = styled(Typography)`
  font-size: 24px !important;
  line-height: 29px !important;
  margin-bottom: 8px !important;
  font-weight: bold !important;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 52px !important;
    line-height: 64px !important;
    margin-bottom: 0;
    font-weight: normal !important;
  }
`

const DescriptionText = styled(Typography)`
  font-size: 14px !important;
  line-height: 17px !important;
  margin-bottom: 45px !important;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 20px !important;
    line-height: 25px !important;
    margin-bottom: 62px !important;
  }
`