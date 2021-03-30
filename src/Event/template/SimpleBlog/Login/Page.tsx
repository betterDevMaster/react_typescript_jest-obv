import {LoginProps} from 'Event/auth/Login'
import {useEvent} from 'Event/EventProvider'
import styled from 'styled-components'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import MuiTextField, {TextFieldProps} from '@material-ui/core/TextField'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'
import defaultLogo from 'assets/images/logo_vertical.png'
import defaultBackground from 'assets/images/background_login.png'
import {useTemplate} from 'Event/TemplateProvider'
import {makeStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'

export default function Page(props: {
  isPreview: LoginProps['isPreview']
  children: React.ReactElement | React.ReactElement[]
}) {
  const {event} = useEvent()

  const background = event.login_background
    ? event.login_background.url
    : defaultBackground

  return (
    <Background
      background={background}
      isPreview={props.isPreview}
      aria-label="login background"
    >
      <Container>
        <Logo />
        {props.children}
      </Container>
    </Background>
  )
}

function Logo() {
  const {event} = useEvent()
  const logo = event.login_logo ? event.login_logo.url : defaultLogo
  const {login} = useTemplate()

  return (
    <LogoImage
      src={logo}
      alt={event.name}
      aria-label="login logo"
      height={`${login.size.height}`}
      width={`${login.size.width}`}
    />
  )
}

export function Description(props: {children: string; 'aria-label'?: string}) {
  const template = useTemplate()
  const color = template.login.description.color
  const fontSize = template.login.description.fontSize

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
  const {login} = useTemplate()

  return (
    <StyledButton
      variant="contained"
      fullWidth
      backgroundColor={login.submitButton.backgroundColor}
      color={login.submitButton.textColor}
      {...props}
    />
  )
}

export const LogoImage = styled.img`
  margin-bottom: ${(props) => props.theme.spacing[12]};
  max-height: 150px;
  max-width: 200px;
`

export const DescriptionText = styled.div<{
  color?: string | null
  fontSize: number
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-weight: 500;
  margin-bottom: ${(props) => props.theme.spacing[8]};
`

export const Background = styled.div<{
  background: string
  isPreview?: boolean
}>`
  background: url(${(props) => props.background});
  background-size: cover;
  background-position: center;
  position: ${(props) => (props.isPreview ? 'inherit' : 'absolute')};
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

export function TextField(props: TextFieldProps) {
  const useStyles = makeStyles({
    root: {
      backgroundColor: '#f2f5f9',
      borderRadius: spacing[14],
    },
    outline: {
      border: 'none',
    },
  })

  const classes = useStyles()

  return (
    <MuiTextField
      {...props}
      variant="outlined"
      InputProps={{
        classes: {
          root: classes.root,
          notchedOutline: classes.outline,
        },
      }}
    />
  )
}

export const StyledButton = styled(
  ({color, backgroundColor, ...otherProps}) => <MuiButton {...otherProps} />,
)`
  border-radius: ${(props) => props.theme.spacing[14]} !important;
  height: 50px;
  color: ${(props) => props.color} !important;
  background-color: ${(props) => props.backgroundColor} !important;
`
export const Container = styled.div`
  width: auto;
  padding: ${(props) => props.theme.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 600px;
  }
`

export const ErrorText = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
  text-align: center;
`
