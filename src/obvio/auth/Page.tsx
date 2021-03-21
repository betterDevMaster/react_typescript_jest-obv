import MuiButton from '@material-ui/core/Button/Button'
import styled from 'styled-components'
import MuiTextField, {TextFieldProps} from '@material-ui/core/TextField'
import Center from 'lib/ui/layout/Center'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import backgroundImg from 'assets/images/background_login.png'
import logoImgVertical from 'assets/images/logo_vertical.png'
import {makeStyles} from '@material-ui/core/styles'

export default function Page(props: {
  children: React.ReactElement | React.ReactElement[]
}) {
  return (
    <Background>
      <Container>
        <Logo src={logoImgVertical} alt="logo_image" />
        {props.children}
      </Container>
    </Background>
  )
}

export function Error(props: {children?: string}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const Logo = styled.img`
  margin-bottom: ${(props) => props.theme.spacing[12]};
`

export const Description = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 20px;
  font-weight: 500;
  margin-bottom: ${(props) => props.theme.spacing[8]};
`

const Background = styled(Center)`
  background: url(${backgroundImg});
  background-size: cover;
  background-position: center;
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

export const Button = styled(MuiButton)`
  border-radius: ${(props) => props.theme.spacing[4]} !important;
  height: 50px;
`

export const Link = styled(RelativeLink)`
  margin-top: ${(props) => props.theme.spacing[4]};
  color: #2066a7;
`

const Container = styled.div`
  width: 100%;
  padding: ${(props) => props.theme.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 600px;
  }
`

const ErrorText = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`
export const BackButton = styled(MuiButton)`
  border-radius: ${(props) => props.theme.spacing[4]} !important;
  height: 50px;
  margin-top: 10px !important;
  color: #3490dc !important;
`
