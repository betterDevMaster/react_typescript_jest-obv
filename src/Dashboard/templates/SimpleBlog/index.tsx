import React, {useState} from 'react'
import styled from 'styled-components'
import SimpleBlogStyles from 'Dashboard/templates/SimpleBlog/Styles'
import NavButtonComponent, {
  NavButtonWithSize,
  NavButton,
} from 'Dashboard/components/NavButton'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import {BlogPost} from 'Dashboard/components/BlogPost'
import Header from 'Dashboard/templates/SimpleBlog/Header'
import Menu from 'Dashboard/templates/SimpleBlog/Menu'
import {User} from 'user'
import WelcomeText from 'Dashboard/templates/SimpleBlog/WelcomeText'
import Hidden from '@material-ui/core/Hidden'
import BlogPosts from 'Dashboard/templates/SimpleBlog/BlogPosts'
import Sidebar, {SidebarProps} from 'Dashboard/templates/SimpleBlog/Sidebar'
import Footer from 'Dashboard/templates/SimpleBlog/Footer'
import {withStyles} from '@material-ui/core'
import {Agenda} from 'Dashboard/components/AgendaList'
import {Emoji} from 'Dashboard/components/EmojiList/emoji'
import {Points} from 'Dashboard/components/PointsSummary'
import {ResourceList} from 'Dashboard/components/ResourceList'
import {TicketRibbon} from 'Dashboard/components/TicketRibbon'

export const SIMPLE_BLOG = 'SIMPLE_BLOG'
export type SimpleBlogDashboard = {
  template: typeof SIMPLE_BLOG
  title: string
  primaryColor: string
  ticketRibbon: TicketRibbon | null
  logo: string
  welcomeText: string
  emojis: Emoji[]
  sidebar: {
    background: string
    textColor: string
    navButtons: NavButton[]
  }
  mainNavButtons: NavButtonWithSize[]
  blogPosts: BlogPost[]
  agendas: Agenda[]
  points: Points | null
  resourceList: ResourceList
}

export const SimpleBlog = (props: {
  dashboard: SimpleBlogDashboard
  user: User
}) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  const sidebarProps: SidebarProps = {
    ...props.dashboard.sidebar,
    emojis: props.dashboard.emojis,
    agendas: props.dashboard.agendas,
    points: props.dashboard.points,
    resourceList: props.dashboard.resourceList,
    ticketRibbon: props.dashboard.ticketRibbon,
    primaryColor: props.dashboard.primaryColor,
  }

  return (
    <Box>
      <SimpleBlogStyles primaryColor={props.dashboard.primaryColor} />
      <Menu
        visible={menuVisible}
        background={props.dashboard.primaryColor}
        toggle={toggleMenu}
        user={props.user}
      />
      <Header
        logo={props.dashboard.logo}
        title={props.dashboard.title}
        primaryColor={props.dashboard.primaryColor}
        menuVisible={menuVisible}
        toggleMenu={toggleMenu}
      />
      <Content>
        <StyledContainer maxWidth="lg">
          <WelcomeText>{props.dashboard.welcomeText}</WelcomeText>
          <MainNavButtons>
            <Grid container spacing={2}>
              {props.dashboard.mainNavButtons.map((button) => (
                <Grid item xs={12} md={button.size} key={button.text}>
                  <NavButtonComponent {...button} ariaLabel="main nav button" />
                </Grid>
              ))}
            </Grid>
          </MainNavButtons>
          <FullHeightGrid container spacing={2}>
            <Hidden mdUp>
              <Grid item xs={12}>
                <Sidebar {...sidebarProps} />
              </Grid>
            </Hidden>
            <Grid item xs={12} md={8}>
              <BlogPosts />
            </Grid>
            <Hidden smDown>
              <Grid item xs={12} md={4}>
                <Sidebar {...sidebarProps} />
              </Grid>
            </Hidden>
          </FullHeightGrid>
        </StyledContainer>
      </Content>
      <Footer />
    </Box>
  )
}

const Box = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1;
  margin-bottom: 20px;
  display: flex;
`

const MainNavButtons = styled.div`
  margin-bottom: 30px;
`

const StyledContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
})(Container)

const FullHeightGrid = withStyles({
  root: {
    flex: 1,
  },
})(Grid)
