import Container from '@material-ui/core/Container'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Layout from 'organization/user/Layout'
import React from 'react'

export default function Page(props: {children: NonNullable<React.ReactNode>}) {
  return (
    <Layout>
      <StyledContainer>{props.children}</StyledContainer>
    </Layout>
  )
}

const StyledContainer = withStyles({
  root: {
    paddingTop: spacing[6],
    paddingBottom: spacing[8],
  },
})(Container)
