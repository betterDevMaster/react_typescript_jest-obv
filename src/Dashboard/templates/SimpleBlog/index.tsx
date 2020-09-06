import React, {useState} from 'react'
import SimpleBlogStyles from 'Dashboard/templates/SimpleBlog/Styles'
import MainNavButton from 'Dashboard/components/MainNavButton'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import BlogPost from 'Dashboard/components/BlogPost'
import Header from 'Dashboard/templates/SimpleBlog/Header'
import Menu from 'Dashboard/templates/SimpleBlog/Menu'
import {User} from 'user'
import WelcomeText from 'Dashboard/templates/SimpleBlog/WelcomeText'

export const SIMPLE_BLOG = 'SIMPLE_BLOG'
export type SimpleBlogDashboard = {
  template: typeof SIMPLE_BLOG
  title: string
  primaryColor: string
  logo: string
  welcomeText: string
  sidebar: {
    background: string
  }
  mainNavButtons: MainNavButton[]
  blogPosts: BlogPost[]
}

export const SimpleBlog = (props: {
  dashboard: SimpleBlogDashboard
  user: User
}) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  return (
    <div>
      <SimpleBlogStyles />
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
      <Container maxWidth="lg">
        <WelcomeText>{props.dashboard.welcomeText}</WelcomeText>
        <Grid container spacing={2}>
          {props.dashboard.mainNavButtons.map((button) => (
            <Grid item xs={12} md={button.size} key={button.text}>
              <MainNavButton {...button} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  )
}
