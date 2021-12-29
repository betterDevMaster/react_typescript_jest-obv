import React from 'react'
import styled from 'styled-components'

import {Paper, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import MuiTextField, {TextFieldProps} from '@material-ui/core/TextField'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'

import {LoginProps} from 'Event/auth/Login'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import Logo from 'Event/template/FiftyBlog/Login/Logo'

import {rgba} from 'lib/color'

import PasswordField from 'lib/ui/TextField/PasswordField'

export default function Page(props: {
  isPreview?: LoginProps['isPreview']
  children: React.ReactElement | React.ReactElement[]
}) {
  const template = useFiftyBlogTemplate()
  const {login, loginBackground, loginBackgroundProps} = template
  const background = loginBackground ? loginBackground : null

  return (
    <Background
      background={background}
      backgroundColor={rgba(login.backgroundColor, login.backgroundOpacity)}
      isPreview={props.isPreview}
      aria-label="login background"
      isHidden={!background && loginBackgroundProps.hidden ? true : false}
    >
      <Logo />
      <Container>{props.children}</Container>
    </Background>
  )
}

export function Description(props: {children: string; 'aria-label'?: string}) {
  const template = useFiftyBlogTemplate()
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
  const template = useFiftyBlogTemplate()
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
`

export const Background = styled.div<{
  background: any
  backgroundColor: string
  isPreview?: boolean
  isHidden?: boolean
}>`
  background-size: 100% 100% !important;
  background-position: center;
  background-repeat: no-repeat !important;
  background: ${(props) =>
    !props.isHidden && props.background
      ? `url(${props.background})`
      : props.backgroundColor};
  position: ${(props) => (props.isPreview ? 'inherit' : 'absolute')};
  width: 100%;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  transition: all 300ms ease-in 200ms;
  justify-content: center;
  display: flex;
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
  const template = useFiftyBlogTemplate()
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
  height: 50px;
  color: ${(props) => props.color} !important;
  background: ${(props) => props.backgroundColor} !important;

  &:hover {
    background: ${(props) => props.hoverColor} !important;
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

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

export const ErrorText = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
  text-align: center;
`

export const StyledPaper = styled(Paper)`
  padding: ${(props) => props.theme.spacing[10]};
  display: flex;
  vertical-align: middle;
  background-color: inherit;
  height: 80vh;
  width: 100%;
  box-shadow: none;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    border-radius: 10px 10px 0 0;
    height: 80vh;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    border-radius: 10px 10px 0 0;
    height: 100vh;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    border-radius: unset;
    height: 100vh;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.xl}) {
    border-radius: 10px;
    height: 100vh;
  }
`

export const StyledFormContainer = styled.div`
  margin: auto;
`
