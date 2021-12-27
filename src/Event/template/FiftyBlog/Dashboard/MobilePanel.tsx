import React, {useState} from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'

import Logo from 'Event/Logo'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import EmojiList from 'Event/template/FiftyBlog/Dashboard/EmojiList'
import MainNavMobile from 'Event/template/FiftyBlog/Dashboard/MainNav/MainNavMobile'
import LeftPanelConfig from 'Event/template/FiftyBlog/Dashboard/LeftPanel/LeftPanelConfig'
import RightPanelConfig from 'Event/template/FiftyBlog/Dashboard/RightPanel/RightPanelConfig'

import {rgba} from 'lib/color'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import EditIconButton from 'lib/ui/IconButton/EditIconButton'

import defaultBackground from 'assets/images/background.png'
import defaultLogo from 'assets/images/logo.png'

interface PanelEdit {
  leftPanel: boolean
  rightPanel: boolean
}

export default function MobilePanel(props: {
  children: React.ReactElement
  onChangeTab: (tab: number) => void
  user: User
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const template = useFiftyBlogTemplate()
  const background = template.dashboardBackground
    ? template.dashboardBackground
    : defaultBackground
  const logo = template.dashboardLogo ? template.dashboardLogo : defaultLogo
  const [isEditing, setIsEditing] = useState<PanelEdit>({
    leftPanel: false,
    rightPanel: false,
  })

  const handleChangeTab = (tab: number) => {
    props.onChangeTab(tab)
    setMenuVisible(false)
  }

  return (
    <Box>
      <Container
        backgroundColor={rgba(
          template.leftPanel.backgroundColor,
          template.leftPanel.backgroundOpacity,
        )}
        backgroundImage={background}
        isBackgroundHidden={template.dashboardBackgroundProps.hidden}
      >
        <LeftPanelIconButton
          onClick={() => setIsEditing({...isEditing, leftPanel: true})}
        />
        <LeftPanelConfig
          isMobile={true}
          isVisible={isEditing.leftPanel}
          onClose={() => setIsEditing({...isEditing, leftPanel: false})}
        />
        <StyledMenuIconButton
          active={menuVisible}
          iconColor={template.leftPanel.barTextColor}
          onClick={toggleMenu}
        />
        <EmojiList />
        <Logo
          src={logo}
          hidden={template.dashboardLogoProps.hidden}
          size={template.dashboardLogoProps.size}
        />
        <MainNavMobile
          menuVisible={menuVisible}
          onChangeTab={handleChangeTab}
          user={props.user}
        />
      </Container>
      <Content>{props.children}</Content>
    </Box>
  )
}

function Content(props: {children: React.ReactElement}) {
  const template = useFiftyBlogTemplate()
  const [isEditing, setIsEditing] = useState<PanelEdit>({
    leftPanel: false,
    rightPanel: false,
  })

  return (
    <Panel
      backgroundColor={rgba(
        template.rightPanel.backgroundColor,
        template.rightPanel.backgroundOpacity,
      )}
    >
      <RightPanelIconButton
        onClick={() => setIsEditing({...isEditing, rightPanel: true})}
      />
      <RightPanelConfig
        isMobile={true}
        isVisible={isEditing.rightPanel}
        onClose={() => setIsEditing({...isEditing, rightPanel: false})}
      />
      {props.children}
    </Panel>
  )
}

const Box = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`

const Container = styled.div<{
  backgroundColor: string
  backgroundImage: string
  isBackgroundHidden: boolean
}>`
  padding: ${(props) => props.theme.spacing[6]}
    ${(props) => props.theme.spacing[6]} ${(props) => props.theme.spacing[9]};
  ${(props) =>
    props.isBackgroundHidden
      ? `background: ${props.backgroundColor};`
      : `background: url(${props.backgroundImage});`}
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: column;
`

const Panel = styled.div<{
  backgroundColor: string
}>`
  flex: 1;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  padding: ${(props) => props.theme.spacing[6]}
    ${(props) => props.theme.spacing[6]} ${(props) => props.theme.spacing[9]};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: ${(props) => props.backgroundColor};
  width: 100%;
  position: relative;
  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: calc(100% - 40px);
  }
`

const StyledMenuIconButton = styled(MenuIconButton)`
  position: absolute;
  top: 24px;
  left: 12px;
`

const LeftPanelIconButton = styled(EditIconButton)`
  position: absolute;
  top: 14px;
  right: 12px;
`

const RightPanelIconButton = styled(EditIconButton)`
  position: absolute;
  top: 10px;
  right: 12px;
`
