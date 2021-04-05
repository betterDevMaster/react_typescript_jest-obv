import React, {useState} from 'react'
import styled from 'styled-components'
import SimpleBlogStyles from 'Event/template/SimpleBlog/Styles'
import Container from '@material-ui/core/Container'
import Header from 'Event/template/SimpleBlog/Dashboard/Header'
import Menu from 'Event/template/SimpleBlog/Menu'
import {User} from 'auth/user'
import Footer from 'Event/template/SimpleBlog/Dashboard/Footer'
import {withStyles} from '@material-ui/core'
import {useTemplate} from 'Event/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import {SimpleBlog} from 'Event/template/SimpleBlog'

export default function SimpleBlogPage(props: {
  user: User
  children: React.ReactElement | React.ReactElement[]
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const {backgroundPosition} = useTemplate()
  const {event} = useEvent()
  const dashboardBackground = event.dashboard_background
    ? event.dashboard_background.url
    : ''

  return (
    <Box background={dashboardBackground} position={backgroundPosition}>
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
      <Footer />
    </Box>
  )
}

const Box = styled.div<{
  background: string | null
  position: SimpleBlog['backgroundPosition']
}>`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(props) =>
    props.background ? `url(${props.background})` : '#FFFFFF'};
  ${(props) =>
    props.position === 'bottom' &&
    `
      background-position: bottom;
    `}
  ${(props) =>
    props.position === 'fixed' &&
    `
      background-position: bottom;
      background-attachment: fixed;
    `}
  background-repeat: no-repeat;
`

const Content = styled.div`
  flex: 1;
  margin-bottom: 20px;
  display: flex;
`

const StyledContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
})(Container)
