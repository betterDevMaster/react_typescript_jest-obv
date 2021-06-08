import Logo from 'Event/Logo'
import styled from 'styled-components'
import React, {useState} from 'react'
import {usePanels} from 'Event/template/Panels'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import Menu from 'Event/template/Panels/Dashboard/Menu'
import MainNav from 'Event/template/Panels/Dashboard/MainNav'
import EmojiList from 'Event/template/Panels/Dashboard/EmojiList'

export default function MobilePanel(props: {
  children: React.ReactElement
  onChangeTab: (tab: number) => void
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const {
    template: {isDarkMode},
  } = usePanels()

  const menuIconColor = isDarkMode ? '#ffffff' : '#000000'

  const handleChangeTab = (tab: number) => {
    props.onChangeTab(tab)
    setMenuVisible(false)
  }

  return (
    <Box>
      <StyledMenuIconButton
        active={menuVisible}
        iconColor={menuIconColor}
        onClick={toggleMenu}
      />
      <LogoBox>
        <Logo />
      </LogoBox>
      <Content menuVisible={menuVisible} onChangeTab={handleChangeTab}>
        {props.children}
      </Content>
    </Box>
  )
}

function Content(props: {
  menuVisible: boolean
  children: React.ReactElement
  onChangeTab: (tab: number) => void
}) {
  if (props.menuVisible) {
    return <Menu onChangeTab={props.onChangeTab} />
  }

  return (
    <>
      <Top>
        <MainNav />
        <EmojiList />
      </Top>
      <Panel backgroundColor="#ffffff">{props.children}</Panel>
    </>
  )
}

const Box = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`

const LogoBox = styled.div`
  max-width: 260px;
  max-height: 260px;
`

const Panel = styled.div<{
  backgroundColor: string
}>`
  flex: 1;
  margin-top: 24px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 24px 24px 36px;
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
  padding: 0 40px;
`
