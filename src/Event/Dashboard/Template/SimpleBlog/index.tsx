import React, {useState} from 'react'
import styled from 'styled-components'
import SimpleBlogStyles from 'Event/Dashboard/Template/SimpleBlog/Styles'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import Header from 'Event/Dashboard/Template/SimpleBlog/Header'
import Menu from 'Event/Dashboard/Template/SimpleBlog/Menu'
import {User} from 'auth/user'
import WelcomeText, {
  WELCOME_TEXT,
} from 'Event/Dashboard/Template/SimpleBlog/WelcomeText'
import Hidden from '@material-ui/core/Hidden'
import BlogPosts from 'Event/Dashboard/Template/SimpleBlog/BlogPosts'
import Sidebar from 'Event/Dashboard/Template/SimpleBlog/Sidebar'
import Footer from 'Event/Dashboard/Template/SimpleBlog/Footer'
import {withStyles} from '@material-ui/core'
import {Agenda} from 'Event/Dashboard/components/AgendaList'
import {Points} from 'Event/Dashboard/components/PointsSummary'
import {ResourceList} from 'Event/Dashboard/components/ResourceList'
import {TicketRibbon} from 'Event/Dashboard/components/TicketRibbon'
import {EmojiList} from 'Event/Dashboard/components/EmojiList'
import {EntityList} from 'lib/list'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import MainNav from 'Event/Dashboard/Template/SimpleBlog/MainNav'
import {useDashboard} from 'Event/Dashboard/state/DashboardProvider'

export const SIMPLE_BLOG = 'Simple Blog'

export interface SimpleBlog {
  version: number
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
  const {primaryColor} = useDashboard()

  return (
    <Box>
      <SimpleBlogStyles primaryColor={primaryColor} />
      <Menu
        visible={menuVisible}
        background={primaryColor}
        toggle={toggleMenu}
        user={props.user}
      />
      <EditComponent component={{type: SIMPLE_BLOG}}>
        <Header
          primaryColor={primaryColor}
          menuVisible={menuVisible}
          toggleMenu={toggleMenu}
          aria-label="header"
        />
      </EditComponent>
      <Content>
        <StyledContainer maxWidth="lg">
          <EditComponent component={{type: WELCOME_TEXT}}>
            <WelcomeText />
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
  version: 1,
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
