import React from 'react'
import styled from 'styled-components'
import {Container, StyledHeader, ConnectLabel, Paragraph} from './shared'
import Button from 'lib/ui/Button'

export type InfusionsoftProps = {
  link: () => void
}

export default function Infusionsoft(props: InfusionsoftProps) {
  return (
    <Container>
      <StyledHeader>Infusionsoft</StyledHeader>
      <ConnectLabel>Connect Infusionsoft</ConnectLabel>
      <Paragraph>
        Click the button below to link obv.io with Infusionsoft.
      </Paragraph>
      <Paragraph>
        You will be redirected to Infusionsoft to complete authorization.
      </Paragraph>
      <LinkButton variant="contained" color="primary" onClick={props.link}>
        Link
      </LinkButton>
    </Container>
  )
}

const LinkButton = styled(Button)`
  margin: ${(props) => `${props.theme.spacing[1]} 0`} !important;
`
