import React, {useState} from 'react'
import styled from 'styled-components'
import SimpleBlogStyles from 'Dashboard/Template/SimpleBlog/Styles'
import {NavButtonWithSize, NavButton} from 'Dashboard/components/NavButton'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import {BlogPost} from 'Dashboard/components/BlogPost'
import Header from 'Dashboard/Template/SimpleBlog/Header'
import Menu from 'Dashboard/Template/SimpleBlog/Menu'
import {User} from 'user'
import WelcomeText, {
  WELCOME_TEXT,
} from 'Dashboard/Template/SimpleBlog/WelcomeText'
import Hidden from '@material-ui/core/Hidden'
import BlogPosts from 'Dashboard/Template/SimpleBlog/BlogPosts'
import Sidebar from 'Dashboard/Template/SimpleBlog/Sidebar'
import Footer from 'Dashboard/Template/SimpleBlog/Footer'
import {withStyles} from '@material-ui/core'
import {Agenda} from 'Dashboard/components/AgendaList'
import {Points} from 'Dashboard/components/PointsSummary'
import {ResourceList} from 'Dashboard/components/ResourceList'
import {TicketRibbon} from 'Dashboard/components/TicketRibbon'
import {EmojiList} from 'Dashboard/components/EmojiList'
import {EntityList} from 'lib/list'
import MainNavButton from 'Dashboard/Template/SimpleBlog/MainNavButton'
import {usePrimaryColor} from 'Dashboard/Template/SimpleBlog/primary-color'
import EditComponent from 'Dashboard/edit/views/EditComponent'
import NewMainNavButton from 'Dashboard/Template/SimpleBlog/MainNavButton/NewMainNavButton'

export const SIMPLE_BLOG = 'Simple Blog'
export interface SimpleBlog {
  template: typeof SIMPLE_BLOG
  title: string
  mainNavButtons: EntityList<NavButtonWithSize>
  primaryColor: string
  ticketRibbon: TicketRibbon | null
  logo: string
  welcomeText: string
  emojiList: EmojiList | null
  sidebarBackground: string
  sidebarTextColor: string
  sidebarNavButtons: EntityList<NavButton>
  blogPosts: EntityList<BlogPost>
  agendas: Agenda[]
  points: Points | null
  resourceList: ResourceList
  footerBackground: string
  footerTextColor: string
  footerTermsLink: string | null
  footerPrivacyLink: string | null
  footerCopyrightText: string | null
}

export default function SimpleBlog(props: {
  dashboard: SimpleBlog
  user: User
  isEditMode: boolean
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const primaryColor = usePrimaryColor(props.isEditMode, props.dashboard)

  return (
    <Box>
      <SimpleBlogStyles primaryColor={primaryColor} />
      <Menu
        visible={menuVisible}
        background={primaryColor}
        toggle={toggleMenu}
        user={props.user}
      />
      <EditComponent type={SIMPLE_BLOG} isEditMode={props.isEditMode}>
        <Header
          logo={props.dashboard.logo}
          title={props.dashboard.title}
          primaryColor={primaryColor}
          menuVisible={menuVisible}
          toggleMenu={toggleMenu}
          aria-label="header"
        />
      </EditComponent>
      <Content>
        <StyledContainer maxWidth="lg">
          <EditComponent type={WELCOME_TEXT}>
            <WelcomeText isEditMode={props.isEditMode}>
              {props.dashboard.welcomeText}
            </WelcomeText>
          </EditComponent>
          <MainNavButtons>
            <Grid container spacing={2}>
              {props.dashboard.mainNavButtons.ids.map((id) => (
                <MainNavButton
                  key={id}
                  id={id}
                  buttons={props.dashboard.mainNavButtons}
                  isEditMode={props.isEditMode}
                />
              ))}
              <NewMainNavButton isEditMode={props.isEditMode} />
            </Grid>
          </MainNavButtons>
          <FullHeightGrid container spacing={4}>
            <Hidden mdUp>
              <Grid item xs={12}>
                <Sidebar {...props.dashboard} />
              </Grid>
            </Hidden>
            <Grid item xs={12} md={8}>
              <BlogPosts posts={props.dashboard.blogPosts} />
            </Grid>
            <Hidden smDown>
              <Grid item xs={12} md={4}>
                <Sidebar {...props.dashboard} primaryColor={primaryColor} />
              </Grid>
            </Hidden>
          </FullHeightGrid>
        </StyledContainer>
      </Content>
      <Footer {...props.dashboard} />
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
