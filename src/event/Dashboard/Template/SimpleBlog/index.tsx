import React, {useState} from 'react'
import styled from 'styled-components'
import SimpleBlogStyles from 'event/Dashboard/Template/SimpleBlog/Styles'
import NavButton, {
  NavButtonWithSize,
} from 'event/Dashboard/components/NavButton'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import {BlogPost} from 'event/Dashboard/components/BlogPost'
import Header from 'event/Dashboard/Template/SimpleBlog/Header'
import Menu from 'event/Dashboard/Template/SimpleBlog/Menu'
import {User} from 'auth/user'
import WelcomeText, {
  WELCOME_TEXT,
} from 'event/Dashboard/Template/SimpleBlog/WelcomeText'
import Hidden from '@material-ui/core/Hidden'
import BlogPosts from 'event/Dashboard/Template/SimpleBlog/BlogPosts'
import Sidebar from 'event/Dashboard/Template/SimpleBlog/Sidebar'
import Footer from 'event/Dashboard/Template/SimpleBlog/Footer'
import {withStyles} from '@material-ui/core'
import {Agenda} from 'event/Dashboard/components/AgendaList'
import {Points} from 'event/Dashboard/components/PointsSummary'
import {ResourceList} from 'event/Dashboard/components/ResourceList'
import {TicketRibbon} from 'event/Dashboard/components/TicketRibbon'
import {EmojiList} from 'event/Dashboard/components/EmojiList'
import {EntityList} from 'lib/list'
import EditComponent from 'event/Dashboard/editor/views/EditComponent'
import MainNav from 'event/Dashboard/Template/SimpleBlog/MainNav'
import {useDashboard} from 'event/Dashboard/state/DashboardProvider'

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

export const createSimpleBlog = (): SimpleBlog => ({
  template: SIMPLE_BLOG,
  title: '',
  mainNav: {
    entities: {},
    ids: [],
  },
  primaryColor: '#000000',
  ticketRibbon: null,
  logo: '',
  welcomeText: 'WELCOME TO YOUR DASHBOARD',
  emojiList: {
    emojis: [],
  },
  sidebar: {
    background: 'blue',
    textColor: '#ffffff',
  },
  sidebarNav: {
    entities: {},
    ids: [],
  },
  blogPosts: {
    entities: {},
    ids: [],
  },
  agendas: [],
  points: null,
  resourceList: {
    description: '',
    resources: [],
  },
  footer: {
    background: '#000000',
    textColor: '#FFFFFF',
    termsLink: null,
    privacyLink: null,
    copyrightText: null,
  },
})

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
