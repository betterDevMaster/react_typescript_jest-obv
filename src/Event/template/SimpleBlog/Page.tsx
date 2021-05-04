import React, {useState} from 'react'
import styled from 'styled-components'
import SimpleBlogStyles from 'Event/template/SimpleBlog/Styles'
import Container from '@material-ui/core/Container'
import Header from 'Event/template/SimpleBlog/Dashboard/Header'
import Menu from 'Event/template/SimpleBlog/Menu'
import {User} from 'auth/user'
import Footer from 'Event/template/SimpleBlog/Dashboard/Footer'
import {ThemeProvider, withStyles} from '@material-ui/core'
import {useTemplate} from 'Event/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import {SimpleBlog} from 'Event/template/SimpleBlog'
import {rgb} from 'lib/color'
import LanguageSelectMenu from 'Event/LanguageSelectMenu'
import {muiDarkTheme, muiTheme} from 'lib/ui/theme'

export default function SimpleBlogPage(props: {
  user: User
  children: React.ReactElement | React.ReactElement[]
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const {
    backgroundPosition,
    dashboardBackground: dashboard,
    isDarkMode,
  } = useTemplate()
  const {event} = useEvent()
  const dashboardBackground = event.dashboard_background
    ? `url(${event.dashboard_background.url})`
    : '#FFFFFF'

  const backgroundRGBColor = dashboard
    ? rgb(dashboard.color || '#FFFFFF', dashboard.opacity || 0)
    : '#FFFFFF'

  const color = isDarkMode ? '#FFFFFF' : '#000000'

  const theme = isDarkMode ? muiDarkTheme : muiTheme

  return (
    <ThemeProvider theme={theme}>
      <Box
        background={dashboardBackground}
        position={backgroundPosition}
        color={color}
      >
        <ColorOverlay color={backgroundRGBColor}>
          <SimpleBlogStyles />
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
}>`
  height: 100%;
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
  color: ${(props) => props.color};
`

const Content = styled.div`
  flex: 1;
  margin-bottom: 20px;
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
`

const StyledContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})(Container)
