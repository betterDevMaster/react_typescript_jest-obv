import {LoginProps} from 'Event/auth/Login'
import styled from 'styled-components'
import React, {useMemo} from 'react'
import Typography from '@material-ui/core/Typography'
import MuiButton, {ButtonProps} from '@material-ui/core/Button'
import {spacing} from 'lib/ui/theme'
import Logo from 'Event/template/Cards/Login/Logo'
import {rgba} from 'lib/color'
import {useCardsTemplate} from 'Event/template/Cards'
import Paper from '@material-ui/core/Paper'
import BaseTextField from 'Event/ui/TextField'
import {TextFieldProps} from '@material-ui/core/TextField'

export default function Page(props: {
  isPreview?: LoginProps['isPreview']
  children: React.ReactElement | React.ReactElement[]
}) {
  const template = useCardsTemplate()
  const {login} = template

  const background = useRandomBackground()

  const backgroundRGBColor = rgba(
    login.backgroundColor || '#FFFFFF',
    login.backgroundOpacity || 0,
  )
  return (
    <Background
      background={background}
      isPreview={props.isPreview}
      aria-label="login background"
    >
      <ColorOverlay color={backgroundRGBColor}>
        <Logo isHidden={login.logoHidden} />
        <Container>{props.children}</Container>
      </ColorOverlay>
    </Background>
  )
}

export function Title(props: {children: string; 'aria-label'?: string}) {
  const template = useCardsTemplate()
  const color = template.login.welcome.color
  const fontSize = template.login.welcome.fontSize

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

export function Description(props: {children: string; 'aria-label'?: string}) {
  const template = useCardsTemplate()
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
  const template = useCardsTemplate()
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
  mb?: number
  disableMargin?: boolean
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-weight: 500;
  margin-bottom: ${(props) =>
    props.disableMargin ? 0 : props.theme.spacing[4]};
  margin-top: ${(props) => (props.mb ? props.theme.spacing[props.mb] : 0)};
  text-align: left;
`

const Background = styled.div<{
  background: string | null
  isPreview?: boolean
}>`
  ${(props) =>
    props.background ? `background: url(${props.background});` : ''}
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
  -webkit-transition: all 300ms ease-in 200ms;
  -moz-transition: all 300ms ease-in 200ms;
  -o-transition: all 300ms ease-in 200ms;
  transition: all 300ms ease-in 200ms;
`

const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    display: flex;
    flex-direction: row;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.xl}) {
    display: block;
    flex-direction: column;
  }
`

export function TextField(props: TextFieldProps) {
  const template = useCardsTemplate()
  const {login} = template

  return <BaseTextField {...props} borderRadius={login.inputBorderRadius} />
}

export const StyledButton = styled(
  ({
    color: _1,
    backgroundColor: _2,
    borderRadius: _3,
    hoverColor: _4,
    ...otherProps
  }) => <MuiButton {...otherProps} />,
)`
  border-radius: ${(props) => props.borderRadius} !important;
  height: 50px;
  color: ${(props) => props.color} !important;
  background-color: ${(props) => props.backgroundColor} !important;

  &:hover {
    background-color: ${(props) => props.hoverColor} !important;
  }
`

export const StyledPaper = styled(Paper)`
  padding: ${(props) => props.theme.spacing[10]};
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  vertical-align: middle;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    border-radius: 10px 10px 0 0;
    height: unset;
    width: 100%;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    border-radius: 10px 10px 0 0;
    height: unset;
    width: 100%;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    border-radius: unset;
    height: 100vh;
    width: 100%;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.xl}) {
    border-radius: 10px;
    height: unset;
    width: auto;
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
    margin: auto;
    width: 100%;
    margin-bottom: 0;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    margin: unset;
    width: auto;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.xl}) {
    margin: unset;
    width: auto;
  }
`

export const StyledFormContainer = styled.div`
  max-width: 450px;
  margin: auto;
`

export const ErrorText = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
  text-align: center;
`

export function useRandomBackground() {
  const template = useCardsTemplate()

  /**
   * This is annoying, but we need to pull out all individual background property
   * values so that they can be referenced as deps in useMemo. If we placed
   * template in there any updates could result in a new random bg.
   */
  const backgroundImage1 = template.backgroundImage1
  const backgroundImage2 = template.backgroundImage2
  const backgroundImage3 = template.backgroundImage3
  const backgroundImage4 = template.backgroundImage4
  const backgroundImage5 = template.backgroundImage5

  const images = useMemo(
    () =>
      [
        backgroundImage1,
        backgroundImage2,
        backgroundImage3,
        backgroundImage4,
        backgroundImage5,
      ].filter(Boolean),
    [
      backgroundImage1,
      backgroundImage2,
      backgroundImage3,
      backgroundImage4,
      backgroundImage5,
    ],
  ) as string[]

  return useMemo(() => {
    const numImages = images.length

    const hasImage = numImages > 0
    if (!hasImage) {
      return null
    }

    const randomIndex = Math.floor(Math.random() * numImages)
    return images[randomIndex]
  }, [images])
}
