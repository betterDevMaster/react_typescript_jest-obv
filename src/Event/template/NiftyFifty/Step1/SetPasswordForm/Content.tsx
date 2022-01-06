import React from 'react'
import {useForm} from 'react-hook-form'
import styled from 'styled-components'

import {Grid, Typography} from '@material-ui/core'
import MuiTextField, {TextFieldProps} from '@material-ui/core/TextField'
import MuiButton from '@material-ui/core/Button'
import {makeStyles, withStyles} from '@material-ui/core/styles'

import {SetPasswordFormProps} from 'Event/Step1/SetPasswordForm'
import {useAttendeeVariables} from 'Event'
import {DEFAULTS, useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {spacing} from 'lib/ui/theme'
import TextEditorContent from 'lib/ui/form/TextEditor/Content'
import PasswordField from 'lib/ui/TextField/PasswordField'

export default function Content(props: SetPasswordFormProps) {
  const {register, handleSubmit, errors, watch} = useForm()
  const template = useNiftyFiftyTemplate()
  const v = useAttendeeVariables()

  const {setPasswordForm} = template

  const password = watch('password')

  return (
    <Paper>
      <Title align="center" variant="h3">
        {v(setPasswordForm.title)}
      </Title>
      <Description>{v(setPasswordForm?.description || '')}</Description>
      <form onSubmit={handleSubmit(props.submit)}>
        <TextField
          label={v(setPasswordForm?.passwordLabel)}
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
          label={v(setPasswordForm.confirmPasswordLabel)}
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
            errors.password_confirmation && errors.password_confirmation.message
          }
          disabled={props.submitting}
        />
        <Error>{props.responseError && props.responseError.message}</Error>
        <Grid container justify="center">
          <Grid
            item
            xs={12}
            md={
              setPasswordForm?.button.width ||
              DEFAULTS.setPasswordForm.button.width
            }
          >
            <StyledButton
              variant="contained"
              fullWidth
              type="submit"
              backgroundColor={setPasswordForm.button.backgroundColor}
              hoverColor={setPasswordForm.button.hoverBackgroundColor}
              color={setPasswordForm.button.textColor}
              borderRadius={setPasswordForm.button.borderRadius}
              width={setPasswordForm.button.width}
              borderColor={setPasswordForm.button.borderColor}
              borderWidth={setPasswordForm.button.borderWidth}
              aria-label="submit set password form"
            >
              {v(setPasswordForm.button.text)}
            </StyledButton>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

function Description(props: {children?: string}) {
  if (!props.children) {
    return null
  }

  return <DescriptionText>{props.children}</DescriptionText>
}

function TextField(props: TextFieldProps) {
  const template = useNiftyFiftyTemplate()
  const {setPasswordForm} = template

  const useStyles = makeStyles({
    root: {
      backgroundColor: `${setPasswordForm.inputBackgroundColor} !important;`,
      borderRadius: `${setPasswordForm.inputBorderRadius}px !important;`,
      '& .MuiFilledInput-input': {
        borderRadius: `${setPasswordForm.inputBorderRadius}px !important;`,
      },
      '&::before': {
        content: 'unset',
      },
      '&::after': {
        content: 'unset',
      },
    },
  })

  const classes = useStyles()

  const Field = props.type === 'password' ? PasswordField : MuiTextField

  return (
    <Field
      {...props}
      variant="filled"
      InputProps={{
        classes: {
          root: classes.root,
        },
      }}
    />
  )
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
    color,
    backgroundColor,
    borderRadius,
    hoverColor,
    borderColor,
    borderWidth,
    ...otherProps
  }) => <MuiButton {...otherProps} />,
)`
  border-radius: ${(props) => props.borderRadius}px !important;
  color: ${(props) => props.color} !important;
  background: ${(props) => props.backgroundColor} !important;
  border: ${(props) => props.borderWidth}px solid
    ${(props) => props.borderColor} !important;
  &:hover {
    background: ${(props) => props.hoverColor} !important;
  }
`
const Paper = styled.div`
  margin-top: ${(props) => props.theme.spacing[5]};
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

const DescriptionText = styled(TextEditorContent)`
  font-size: 14px !important;
  line-height: 17px !important;
  margin-bottom: 45px !important;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 20px !important;
    line-height: 25px !important;
    margin-bottom: 62px !important;
  }
`
