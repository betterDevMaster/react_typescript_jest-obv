import React, {useState} from 'react'
import styled from 'styled-components'
import SimpleBlogStyles from 'organization/user/event/Dashboard/Template/SimpleBlog/Styles'
import NavButton, {NavButtonWithSize} from 'organization/user/event/Dashboard/components/NavButton'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import {BlogPost} from 'organization/user/event/Dashboard/components/BlogPost'
import Header from 'organization/user/event/Dashboard/Template/SimpleBlog/Header'
import Menu from 'organization/user/event/Dashboard/Template/SimpleBlog/Menu'
import {User} from 'auth/user'
import WelcomeText, {
  WELCOME_TEXT,
} from 'organization/user/event/Dashboard/Template/SimpleBlog/WelcomeText'
import Hidden from '@material-ui/core/Hidden'
import BlogPosts from 'organization/user/event/Dashboard/Template/SimpleBlog/BlogPosts'
import Sidebar from 'organization/user/event/Dashboard/Template/SimpleBlog/Sidebar'
import Footer from 'organization/user/event/Dashboard/Template/SimpleBlog/Footer'
import {withStyles} from '@material-ui/core'
import {Agenda} from 'organization/user/event/Dashboard/components/AgendaList'
import {Points} from 'organization/user/event/Dashboard/components/PointsSummary'
import {ResourceList} from 'organization/user/event/Dashboard/components/ResourceList'
import {TicketRibbon} from 'organization/user/event/Dashboard/components/TicketRibbon'
import {EmojiList} from 'organization/user/event/Dashboard/components/EmojiList'
import {EntityList} from 'lib/list'
import EditComponent from 'organization/user/event/Dashboard/editor/views/EditComponent'
import MainNav from 'organization/user/event/Dashboard/Template/SimpleBlog/MainNav'
import {useDashboard} from 'organization/user/event/Dashboard/state/DashboardProvider'

export const SIMPLE_BLOG = 'SIMPLE_BLOG'

export interface SimpleBlog {
  template: typeof SIMPLE_BLOG
  title: string
  mainNav: EntityList<NavButtonWithSize>
  primaryColor: string
  ticketRibbon: TicketRibbon['name'] | null
  logo: string
  welcomeText: string
  emojiList: EmojiList
  sidebar: {
    background: string
    textColor: string
  }
  sidebarNav: EntityList<NavButton>
  blogPosts: EntityList<BlogPost>
  agendas: Agenda[]
  points: Points | null
  resourceList: ResourceList
  footer: {
    background: string
    textColor: string
    termsLink: string | null
    privacyLink: string | null
    copyrightText: string | null
  }
}

export default function SimpleBlog(props: {user: User}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const {primaryColor, welcomeText} = useDashboard()

  return (
    <Box>
      <SimpleBlogStyles primaryColor={primaryColor} />
      <Menu
        visible={menuVisible}
        background={primaryColor}
        toggle={toggleMenu}
        user={props.user}
      />
      <EditComponent type={SIMPLE_BLOG}>
        <Header
          primaryColor={primaryColor}
          menuVisible={menuVisible}
          toggleMenu={toggleMenu}
          aria-label="header"
        />
      </EditComponent>
      <Content>
        <StyledContainer maxWidth="lg">
          <EditComponent type={WELCOME_TEXT}>
            <WelcomeText>{welcomeText}</WelcomeText>
          </EditComponent>
          <MainNavButtons>
            <Grid container spacing={2}>
              <MainNav />
            </Grid>
          </MainNavButtons>
          <FullHeightGrid container spacing={4}>
            <Hidden mdUp>
              <Grid item xs={12}>
                <Sidebar />
              </Grid>
            </Hidden>
            <Grid item xs={12} md={8}>
              <BlogPosts />
            </Grid>
            <Hidden smDown>
              <Grid item xs={12} md={4}>
                <Sidebar />
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
