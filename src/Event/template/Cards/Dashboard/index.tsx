import React from 'react'
import Grid from '@material-ui/core/Grid'
import {User} from 'auth/user'
import Hidden from '@material-ui/core/Hidden'
import BlogPosts from 'Event/template/Cards/Dashboard/BlogPosts'
import Sidebar from 'Event/template/Cards/Dashboard/Sidebar'
import CardsPage from 'Event/template/Cards/Dashboard/Page'
import BodyHTMLEmbed from 'Event/template/Cards/Dashboard/BodyHTMLEmbed'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import {useCardsTemplate} from 'Event/template/Cards'

export default function CardsDashboard(props: {user: User}) {
  return (
    <CardsPage user={props.user}>
      <FullHeightGrid container spacing={4}>
        <Grid item xs={12} md={12}>
          <Main />
        </Grid>
      </FullHeightGrid>
      <BodyHTMLEmbed />
    </CardsPage>
  )
}

function useSidebarWidth() {
  const isEditMode = useEditMode()
  const {sidebar} = useCardsTemplate()

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
    marginTop: spacing[8],
  },
})(Grid)

function Main() {
  const sidebarWidth = useSidebarWidth()
  const mainWidth = useMainWidth()

  return (
    <Grid container spacing={4}>
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
    </Grid>
  )
}
