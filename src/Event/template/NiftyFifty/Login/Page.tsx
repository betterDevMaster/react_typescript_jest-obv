import React from 'react'
import styled from 'styled-components'

import {Paper, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import MuiTextField, {TextFieldProps} from '@material-ui/core/TextField'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'

import {LoginProps} from 'Event/auth/Login'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import Logo from 'Event/template/NiftyFifty/Login/Logo'

import {rgba} from 'lib/color'

import PasswordField from 'lib/ui/TextField/PasswordField'

export default function Page(props: {
  isPreview?: LoginProps['isPreview']
  children: React.ReactElement | React.ReactElement[]
}) {
  const template = useNiftyFiftyTemplate()
  const {login, loginBackground, loginBackgroundProps} = template
  const background = loginBackground ? loginBackground : null

  return (
    <Background isPreview={props.isPreview}>
      <Logo />
      <Box
        background={background}
        backgroundColor={rgba(login.backgroundColor, login.backgroundOpacity)}
        isHidden={loginBackgroundProps.hidden}
        aria-label="login background"
      >
        {props.children}
      </Box>
    </Background>
  )
}

export function Description(props: {children: string; 'aria-label'?: string}) {
  const template = useNiftyFiftyTemplate()
  const {login} = template
  const color = login.description.color
  const fontSize = login.description.fontSize

  if (!props.children) {
    return null
  }

  return (
    <DescriptionText
      color={color}
      fontSize={fontSize}
      aria-label={props['aria-label']}
    >
      {props.children}
    </DescriptionText>
  )
}

export function ErrorMessage(props: {children?: string}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

export function Button(props: ButtonProps) {
  const template = useNiftyFiftyTemplate()
  const {login} = template
  const borderRadius = `${login.submitButton.borderRadius}px`
  const hoverColor = login.submitButton.hoverColor
  return (
    <StyledButton
      variant="contained"
      fullWidth
      backgroundColor={login.submitButton.backgroundColor}
      color={login.submitButton.textColor}
      borderRadius={borderRadius}
      hoverColor={hoverColor}
      {...props}
    />
  )
}

export const DescriptionText = styled.div<{
  color?: string | null
  fontSize: number
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-weight: 500;
  margin-bottom: ${(props) => props.theme.spacing[8]};
  text-align: center;
  white-space: pre-wrap;
`

export const Background = styled.div<{
  isPreview?: boolean
}>`
  position: ${(props) => (props.isPreview ? 'inherit' : 'absolute')};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 300ms ease-in 200ms;
  display: flex;
  justify-content: center;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: row;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    flex-direction: row;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.xl}) {
    flex-direction: row;
  }
`

export function TextField(props: TextFieldProps) {
  const template = useNiftyFiftyTemplate()
  const {login} = template

  const useStyles = makeStyles({
    root: {
      backgroundColor: '#f2f5f9 !important',
      borderRadius: `${login.inputBorderRadius}px !important;`,
      '& .MuiFilledInput-input': {
        borderRadius: `${login.inputBorderRadius}px !important;`,
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

export const StyledButton = styled(
  ({color, backgroundColor, borderRadius, hoverColor, ...otherProps}) => (
    <MuiButton {...otherProps} />
  ),
)`
  border-radius: ${(props) => props.borderRadius} !important;
  color: ${(props) => props.color} !important;
  background: ${(props) => props.backgroundColor} !important;

  &:hover {
    background: ${(props) => props.hoverColor} !important;
  }
`

export const Box = styled.div<{
  background: any
  backgroundColor: string
  isHidden?: boolean
}>`
  background-size: 100% 100% !important;
  background-position: center;
  background-repeat: no-repeat !important;
  background: ${(props) =>
    !props.isHidden && props.background
      ? `url(${props.background})`
      : props.backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing[5]};

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    margin: auto;
    width: 100%;
    margin-bottom: 0;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 50%;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    width: 50%;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.xl}) {
    width: 50%;
  }
`

export const Container = styled.div<{
  backgroundColor: string
}>`
  background-size: 100% 100% !important;
  background-position: center;
  background-repeat: no-repeat !important;
  background: ${(props) => props.backgroundColor};
  width: 100%;
  height: 100%;
  padding: ${(props) => props.theme.spacing[6]};
`

export const ErrorText = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
  text-align: center;
`

export const StyledPaper = styled(Paper)`
  padding: ${(props) => props.theme.spacing[10]};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-shadow: none;
  background-color: inherit;
`

export const StyledFormContainer = styled.div`
  margin: auto;
`
