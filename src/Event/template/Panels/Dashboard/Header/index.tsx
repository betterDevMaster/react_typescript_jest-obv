import React from 'react'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function Header(props: {
  toggleMenu: () => void
  menuVisible: boolean
  'aria-label'?: string
  isVisible: boolean
}) {
  const menuTextColor = '#FFFFFF'

  if (!props.isVisible) {
    return null
  }

  return (
    <HeaderContainer>
      <CollapsableColorOverlay>
        <Container maxWidth="lg">
          <Layout>
            <Middle>
              <RelativeLink to={eventRoutes.root} disableStyles>
                <StyledMenuItem color={menuTextColor}>Home</StyledMenuItem>
              </RelativeLink>
              <RelativeLink to={eventRoutes.speakers} disableStyles>
                <StyledMenuItem color={menuTextColor}>Speakers</StyledMenuItem>
              </RelativeLink>
              <RelativeLink to={eventRoutes.sponsors} disableStyles>
                <StyledMenuItem color={menuTextColor}>
                  Sponsor Roundtables
                </StyledMenuItem>
              </RelativeLink>
              <RelativeLink to={eventRoutes.faq} disableStyles>
                <StyledMenuItem color={menuTextColor}>Resources</StyledMenuItem>
              </RelativeLink>
              <RelativeLink to={eventRoutes.leaderboard} disableStyles>
                <StyledMenuItem color={menuTextColor}>Points</StyledMenuItem>
              </RelativeLink>
            </Middle>
            <Side />
          </Layout>
        </Container>
      </CollapsableColorOverlay>
    </HeaderContainer>
  )
}

function Layout(props: {children: React.ReactElement | React.ReactElement[]}) {
  return (
    <LayoutBox height={65} arial-label="header layout">
      {props.children}
    </LayoutBox>
  )
}

function CollapsableColorOverlay(props: {children: React.ReactElement}) {
  const backgroundColor = '#54CFD6'

  return (
    <ColorOverlay color={backgroundColor} aria-label="header">
      {props.children}
    </ColorOverlay>
  )
}

const HeaderContainer = styled.div`
  width: ${(props) => `calc(100% - ${props.theme.spacing[12]})`};
  position: absolute;
  z-index: 50;
  top: ${(props) => props.theme.spacing[6]};
`

const LayoutBox = styled.div<{height: number}>`
  height: ${(props) => props.height}px;
  display: flex;
`

const Side = styled.div`
  width: 42px;
`

const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
  border-top-left-radius: ${(props) => props.theme.spacing[3]};
  border-top-right-radius: ${(props) => props.theme.spacing[3]};
`

const Middle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const StyledMenuItem = styled.div<{color: string}>`
  color: ${(props) => props.color};
  padding: ${(props) => props.theme.spacing[4]};
`
