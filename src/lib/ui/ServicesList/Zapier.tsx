import React from 'react'
import styled from 'styled-components'
import {Container, StyledHeader, ConnectLabel, Paragraph} from './shared'

export type ZapierProps = {
  link: string
}

export default function Zapier(props: ZapierProps) {
  return (
    <Container>
      <StyledHeader>Zapier</StyledHeader>
      <ConnectLabel>Connect Zapier</ConnectLabel>
      <Paragraph>
        Open{' '}
        <StyledAnchor
          target="_blank"
          rel="noopener noreferrer"
          href={props.link}
        >
          Zapier.com
        </StyledAnchor>
      </Paragraph>
      <Paragraph>Go to My Apps</Paragraph>
      <Paragraph>Click Add connection</Paragraph>
      <Paragraph>Find and click to OBVIO (2.0.0)</Paragraph>
      <Paragraph>Provide an access token from the services page.</Paragraph>
      <Paragraph>Click to "Yes, Continue"</Paragraph>
      <Paragraph>You are ready to create your first ZAP</Paragraph>
    </Container>
  )
}

const StyledAnchor = styled.a`
  color: ${(props) => props.theme.colors.primary} !important;
  text-decoration: none !important;
  &:hover {
    text-decoration: underline !important;
  }
`
