import React from 'react'
import Grid from '@material-ui/core/Grid'
import {User} from 'auth/user'
import Hidden from '@material-ui/core/Hidden'
import BlogPosts from 'Event/template/SimpleBlog/Dashboard/BlogPosts'
import Sidebar from 'Event/template/SimpleBlog/Dashboard/Sidebar'
import {withStyles} from '@material-ui/core'
import MainNav from 'Event/template/SimpleBlog/Dashboard/MainNav'
import SimpleBlogPage from 'Event/template/SimpleBlog/Page'
import Hero from 'Event/template/SimpleBlog/Dashboard/Hero'
import BodyHTMLEmbed from 'Event/template/SimpleBlog/Dashboard/BodyHTMLEmbed'
import {useTemplate} from 'Event/TemplateProvider'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default function SimpleBlogDashboard(props: {user: User}) {
  const sidebarWidth = useSidebarWidth()
  const mainWidth = useMainWidth()
  return (
    <SimpleBlogPage user={props.user}>
      <Hero />
      <MainNav />
      <FullHeightGrid container spacing={4}>
        <Hidden mdUp>
          <Grid item xs={12}>
            <Sidebar />
          </Grid>
        </Hidden>
        <Grid item xs={12} md={mainWidth}>
          <BlogPosts />
        </Grid>
        <Hidden smDown>
          <Grid item xs={12} md={sidebarWidth}>
            <Sidebar />
          </Grid>
        </Hidden>
      </FullHeightGrid>
      <BodyHTMLEmbed />
    </SimpleBlogPage>
  )
}

function useSidebarWidth() {
  const isEditMode = useEditMode()
  const {sidebar} = useTemplate()

  if (isEditMode || sidebar.isVisible) {
    return 4
  }

  return false
}

function useMainWidth() {
  const sidebarWidth = useSidebarWidth()
  if (!sidebarWidth) {
    return 12
  }

  return 8
}

const FullHeightGrid = withStyles({
  root: {
    flex: 1,
  },
})(Grid)
