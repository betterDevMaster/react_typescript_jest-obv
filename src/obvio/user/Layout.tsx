import Container from '@material-ui/core/Container'
import AppBar from 'obvio/user/AppBar'
import React from 'react'

export default function Layout(props: {children: React.ReactElement}) {
  return (
    <div>
      <AppBar />
      <Container maxWidth="lg">{props.children}</Container>
    </div>
  )
}
