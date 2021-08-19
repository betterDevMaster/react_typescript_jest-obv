import {LoginProps} from 'Event/auth/Login'
import {useEvent} from 'Event/EventProvider'
import styled from 'styled-components'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import MuiTextField, {TextFieldProps} from '@material-ui/core/TextField'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'
import defaultBackground from 'assets/images/background_login.png'
import {makeStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'
import Logo from 'Event/template/SimpleBlog/Login/Logo'
import {rgba} from 'lib/color'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

export default function Page(props: {
  isPreview?: LoginProps['isPreview']
  children: React.ReactElement | React.ReactElement[]
}) {
  const {event} = useEvent()
  const {template} = useSimpleBlog()
  const {login} = template

  const background = event.login_background
    ? event.login_background.url
    : defaultBackground

  const backgroundRGBColor = rgba(
    login.backgroundColor || '#FFFFFF',
    login.backgroundOpacity || 0,
  )
  return (
    <Background
      background={background}
      isPreview={props.isPreview}
      aria-label="login background"
      isHidden={login.backgroundHidden}
    >
      <ColorOverlay color={backgroundRGBColor}>
        <Container>
          <Logo isHidden={login.logoHidden} />
          {props.children}
        </Container>
      </ColorOverlay>
    </Background>
  )
}

export function Description(props: {children: string; 'aria-label'?: string}) {
  const {template} = useSimpleBlog()
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
  const {template} = useSimpleBlog()
  const {login} = template
  const borderRadius = `${login.submitButton.borderRadius}px` || spacing[14]
  const hoverColor =
    login.submitButton.hoverColor || login.submitButton.backgroundColor
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
  disableMargin?: boolean
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-weight: 500;
  margin-bottom: ${(props) =>
    props.disableMargin ? 0 : props.theme.spacing[8]};
  text-align: center;
`

export const Background = styled.div<{
  background: string
  isPreview?: boolean
  isHidden?: boolean
}>`
  ${(props) => (props.isHidden ? '' : `background: url(${props.background});`)}
  display: flex;
  background-size: cover;
  background-position: center;
  position: ${(props) => (props.isPreview ? 'inherit' : 'absolute')};
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
`

export const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`

export function TextField(props: TextFieldProps) {
  const {template} = useSimpleBlog()
  const {login} = template

  const useStyles = makeStyles({
    root: {
      backgroundColor: '#f2f5f9 !important',
      borderRadius: `${login.inputBorderRadius}px !important;` || spacing[14],
      '& .MuiFilledInput-input': {
        borderRadius: `${login.inputBorderRadius}px !important;` || spacing[14],
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

  return (
    <MuiTextField
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
  width: auto;
  padding: ${(props) => props.theme.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 600px;
  }
`

export const ErrorText = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
  text-align: center;
`
