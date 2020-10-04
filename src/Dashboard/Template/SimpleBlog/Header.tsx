import React from 'react'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import {RootState} from 'store'
import {useSelector} from 'react-redux'

export default function Header(props: {
  logo: string
  title: string
  primaryColor: string
  toggleMenu: () => void
  menuVisible: boolean
  'aria-label'?: string
}) {
  const currentLogo = useSelector(
    (state: RootState) => state.dashboardEditor.logo,
  )
  const logo = currentLogo || props.logo

  return (
    <Box aria-label={props['aria-label']}>
      <Container maxWidth="lg">
        <Layout>
          <Side>
            <MenuIconButton
              color={props.primaryColor}
              active={props.menuVisible}
              onClick={props.toggleMenu}
            />
          </Side>
          <Middle>
            <Logo src={logo} alt={props.title} aria-label="logo" />
          </Middle>
          <Side />
        </Layout>
      </Container>
    </Box>
  )
}

const Layout = styled.div`
  height: 115px;
  display: flex;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    height: 150px;
  }
`

const Side = styled.div`
  width: 42px;
`

const Box = styled.div`
  box-shadow: 20px 20px 50px #ddd;
  margin-bottom: 60px;
`

const Middle = styled.div`
  flex: 1;
  text-align: center;
`
const Logo = styled.img`
  max-height: 100%;
  max-width: 100%;
`
