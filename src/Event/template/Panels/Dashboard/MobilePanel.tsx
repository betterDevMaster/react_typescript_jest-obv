import Logo from 'Event/Logo'
import styled from 'styled-components'
import React, {useState} from 'react'
import {usePanelsTemplate} from 'Event/template/Panels'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import Menu from 'Event/template/Panels/Dashboard/Menu'
import MainNavMobile from 'Event/template/Panels/Dashboard/MainNav/MainNavMobile'
import Emojis from 'Event/template/Panels/Dashboard/EmojiList'
import {rgba} from 'lib/color'
import {User} from 'auth/user'
import CountDownTimers from 'Event/template/Panels/Dashboard/CountDownTimers'

export default function MobilePanel(props: {
  children: React.ReactElement
  onChangeTab: (tab: number) => void
  user: User
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const template = usePanelsTemplate()

  const handleChangeTab = (tab: number) => {
    props.onChangeTab(tab)
    setMenuVisible(false)
  }

  return (
    <Box>
      <StyledMenuIconButton
        active={menuVisible}
        iconColor={template.leftPanel.barTextColor}
        onClick={toggleMenu}
      />
      <LogoBox>
        <Logo />
      </LogoBox>
      <Content
        menuVisible={menuVisible}
        onChangeTab={handleChangeTab}
        user={props.user}
      >
        {props.children}
      </Content>
    </Box>
  )
}

function Content(props: {
  menuVisible: boolean
  children: React.ReactElement
  onChangeTab: (tab: number) => void
  user: User
}) {
  const template = usePanelsTemplate()

  if (props.menuVisible) {
    return <Menu onChangeTab={props.onChangeTab} user={props.user} />
  }

  return (
    <>
      <Top>
        <CountDownTimers />
        <MainNavMobile />
        <Emojis />
      </Top>
      <Panel
        backgroundColor={rgba(
          template.rightPanel.backgroundColor,
          template.rightPanel.backgroundOpacity,
        )}
      >
        {props.children}
      </Panel>
    </>
  )
}

const Box = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  overflow: auto;
`

const LogoBox = styled.div`
  max-width: 260px;
  max-height: 260px;
  padding-top: ${(props) => props.theme.spacing[5]};
`

const Panel = styled.div<{
  backgroundColor: string
}>`
  flex: 1;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: ${(props) => props.theme.spacing[6]}
    ${(props) => props.theme.spacing[6]} ${(props) => props.theme.spacing[9]};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: ${(props) => props.backgroundColor};
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: calc(100% - 40px);
  }
`

const StyledMenuIconButton = styled(MenuIconButton)`
  position: absolute;
  top: 24px;
  left: 12px;
`

const Top = styled.div`
  width: 100%;
  padding: 0 ${(props) => props.theme.spacing[10]};
`
