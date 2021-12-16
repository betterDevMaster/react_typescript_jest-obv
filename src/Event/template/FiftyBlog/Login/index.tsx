import React from 'react'
import styled from 'styled-components'

import Page from 'Event/template/FiftyBlog/Login/Page'
import {Box} from '@material-ui/core'

import {LoginProps} from 'Event/auth/Login'
import Logo from 'Event/template/FiftyBlog/Login/Logo'
import Content from 'Event/template/FiftyBlog/Login/Content'

export default function Login(props: LoginProps) {
  return (
    <Page isPreview={props.isPreview}>
      <Box component="form" onSubmit={props.onSubmit}>
        <Logo />
        <Content />
      </Box>
    </Page>
  )
}
