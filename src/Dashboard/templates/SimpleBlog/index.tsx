import React, {useState} from 'react'
import styled from 'styled-components'
import SimpleBlogStyles from 'Dashboard/templates/SimpleBlog/Styles'
import {NavButtonWithSize, NavButton} from 'Dashboard/components/NavButton'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import {BlogPost} from 'Dashboard/components/BlogPost'
import Header from 'Dashboard/templates/SimpleBlog/Header'
import Menu from 'Dashboard/templates/SimpleBlog/Menu'
import {User} from 'user'
import WelcomeText from 'Dashboard/templates/SimpleBlog/WelcomeText'
import Hidden from '@material-ui/core/Hidden'
import BlogPosts from 'Dashboard/templates/SimpleBlog/BlogPosts'
import Sidebar from 'Dashboard/templates/SimpleBlog/Sidebar'
import Footer from 'Dashboard/templates/SimpleBlog/Footer'
import {withStyles} from '@material-ui/core'
import {Agenda} from 'Dashboard/components/AgendaList'
import {Points} from 'Dashboard/components/PointsSummary'
import {ResourceList} from 'Dashboard/components/ResourceList'
import {TicketRibbon} from 'Dashboard/components/TicketRibbon'
import {EmojiList} from 'Dashboard/components/EmojiList'
import {EntityList} from 'lib/list'
import MainNavButton from 'Dashboard/templates/SimpleBlog/MainNavButton'

export const SIMPLE_BLOG = 'SIMPLE_BLOG'
export interface SimpleBlogDashboard {
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

export const SimpleBlog = (props: {
  dashboard: SimpleBlogDashboard
  user: User
  isEditMode: boolean
}) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

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
              {props.dashboard.mainNavButtons.ids.map((id) => (
                <MainNavButton
                  key={id}
                  id={id}
                  buttons={props.dashboard.mainNavButtons}
                  isEditMode={props.isEditMode}
                />
              ))}
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
                <Sidebar {...props.dashboard} />
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
