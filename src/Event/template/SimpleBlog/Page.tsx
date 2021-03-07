import React, {useState} from 'react'
import styled from 'styled-components'
import SimpleBlogStyles from 'Event/template/SimpleBlog/Styles'
import Container from '@material-ui/core/Container'
import Header from 'Event/template/SimpleBlog/Dashboard/Header'
import Menu from 'Event/template/SimpleBlog/Menu'
import {User} from 'auth/user'
import Footer from 'Event/template/SimpleBlog/Dashboard/Footer'
import {withStyles} from '@material-ui/core'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'

export default function SimpleBlogPage(props: {
  user: User
  children: React.ReactElement | React.ReactElement[]
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const {primaryColor} = useTemplate()

  return (
    <Box>
      <SimpleBlogStyles primaryColor={primaryColor} />
      <Menu
        visible={menuVisible}
        background={primaryColor}
        toggle={toggleMenu}
        user={props.user}
      />
      <Header
        primaryColor={primaryColor}
        menuVisible={menuVisible}
        toggleMenu={toggleMenu}
        aria-label="header"
      />
      <Content>
        <StyledContainer maxWidth="lg">{props.children}</StyledContainer>
      </Content>
      <Footer />
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

const StyledContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
})(Container)
