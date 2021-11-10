import React, {useState} from 'react'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Header from 'Event/template/SimpleBlog/Dashboard/Header'
import Menu from 'Event/template/SimpleBlog/Menu'
import {User} from 'auth/user'
import Footer from 'Event/template/SimpleBlog/Dashboard/Footer'
import {useEvent} from 'Event/EventProvider'
import {SimpleBlog, useSimpleBlog} from 'Event/template/SimpleBlog'
import {rgba} from 'lib/color'
import LanguageSelectMenu from 'Event/LanguageSelector'
import {muiDarkTheme, muiTheme} from 'lib/ui/theme'
import {ThemeProvider} from '@material-ui/core/styles'
import {withStyles} from '@material-ui/core/styles'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function SimpleBlogPage(props: {
  user: User
  children: React.ReactElement | React.ReactElement[]
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const {template} = useSimpleBlog()
  const {
    backgroundPosition,
    dashboardBackground: dashboard,
    isDarkMode,
  } = template
  const {event} = useEvent()
  const dashboardBackground = event.dashboard_background
    ? `url(${event.dashboard_background.url})`
    : '#FFFFFF'

  const backgroundRGBColor = dashboard
    ? rgba(dashboard.color || '#FFFFFF', dashboard.opacity || 0)
    : '#FFFFFF'

  const theme = isDarkMode ? muiDarkTheme : muiTheme

  const color = template.textColor
  const linkUnderline = template.linkUnderline
  const linkColor = template.linkColor

  return (
    <ThemeProvider theme={theme}>
      <Box
        background={dashboardBackground}
        position={backgroundPosition}
        color={color}
        linkColor={linkColor}
        linkUnderline={linkUnderline}
      >
        <ColorOverlay color={backgroundRGBColor}>
          <Menu visible={menuVisible} toggle={toggleMenu} user={props.user} />
          <Header
            menuVisible={menuVisible}
            toggleMenu={toggleMenu}
            aria-label="header"
          />
          <Content>
            <StyledContainer maxWidth="lg">{props.children}</StyledContainer>
          </Content>
          <LanguageSelectMenu />
          <Footer />
        </ColorOverlay>
      </Box>
    </ThemeProvider>
  )
}

const Box = styled.div<{
  background: string
  position: SimpleBlog['backgroundPosition']
  color: string
  linkColor: string
  linkUnderline: boolean
}>`
  height: auto;
  font-family: Arial, 'Times New Roman', Verdana;
  font-size: 17px;
  color: ${(props) => props.color};
  background: ${(props) => props.background};
  ${(props) =>
    props.position === 'bottom' &&
    `
      background-position: bottom;
      background-size: cover;
    `}
  ${(props) =>
    props.position === 'fixed' &&
    `
      background-position: bottom;
      background-attachment: fixed;
      background-size: cover;
    `}
  background-repeat: no-repeat;

  a {
    color: ${(props) => props.linkColor};
    text-decoration: none;

    &:hover {
      text-decoration: ${(props) =>
        props.linkUnderline ? 'underline' : 'none'};
    }
  }
`

const Content = styled.div`
  flex: 1;
  margin-bottom: 70px;
  display: flex;
`
const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  min-height: 100vh;
`

const StyledContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})(Container)

export const PageTitle = styled.h2`
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
export const PageDescription = styled.div`
  margin: ${(props) => props.theme.spacing[5]};
  width: 90%;
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 70%;
  }
`

export const BackToDashboardLink = styled(RelativeLink)<{
  color?: string
}>`
  display: block;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
  color: ${(props) => props.color || '#000000'};
`
