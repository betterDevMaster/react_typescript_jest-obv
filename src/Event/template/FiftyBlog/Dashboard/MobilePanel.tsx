import React, {useState} from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'

import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import Logo from 'Event/Logo'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import EmojiList from 'Event/template/FiftyBlog/Dashboard/EmojiList'
import MainNavMobile from 'Event/template/FiftyBlog/Dashboard/MainNav/MainNavMobile'
import LeftPanelConfig from 'Event/template/FiftyBlog/Dashboard/LeftPanel/LeftPanelConfig'
import RightPanelConfig from 'Event/template/FiftyBlog/Dashboard/RightPanel/RightPanelConfig'

import {rgba} from 'lib/color'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import EditIconButton from 'lib/ui/IconButton/EditIconButton'

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
  const {
    dashboardBackground,
    dashboardBackgroundProps,
    dashboardLogo,
    dashboardLogoProps,
    leftPanel,
  } = useFiftyBlogTemplate()

  const background = dashboardBackground ? dashboardBackground : null
  const logo = dashboardLogo ? dashboardLogo : defaultLogo
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
          leftPanel.backgroundColor,
          leftPanel.backgroundOpacity,
        )}
        backgroundImage={background}
        isBackgroundHidden={dashboardBackgroundProps.hidden}
      >
        <EditModeOnly>
          <LeftPanelIconButton
            onClick={() => setIsEditing({...isEditing, leftPanel: true})}
          />
          <LeftPanelConfig
            isVisible={isEditing.leftPanel}
            onClose={() => setIsEditing({...isEditing, leftPanel: false})}
          />
        </EditModeOnly>
        <StyledMenuIconButton
          active={menuVisible}
          iconColor={leftPanel.barTextColor}
          onClick={toggleMenu}
        />
        <EmojiList />
        <Logo
          src={logo}
          hidden={dashboardLogoProps.hidden}
          size={dashboardLogoProps.size}
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
  const {rightPanel} = useFiftyBlogTemplate()
  const [isEditing, setIsEditing] = useState<PanelEdit>({
    leftPanel: false,
    rightPanel: false,
  })

  return (
    <Panel
      backgroundColor={rgba(
        rightPanel.backgroundColor,
        rightPanel.backgroundOpacity,
      )}
    >
      <EditModeOnly>
        <RightPanelIconButton
          onClick={() => setIsEditing({...isEditing, rightPanel: true})}
        />
        <RightPanelConfig
          isVisible={isEditing.rightPanel}
          onClose={() => setIsEditing({...isEditing, rightPanel: false})}
        />
      </EditModeOnly>
      {props.children}
    </Panel>
  )
}

const Box = styled.div`
  position: relative;
  overflow: auto;
`

const Container = styled.div<{
  backgroundColor: string
  backgroundImage: any
  isBackgroundHidden: boolean
}>`
  padding: ${(props) => props.theme.spacing[12]}
    ${(props) => props.theme.spacing[6]} ${(props) => props.theme.spacing[5]};
  background-size: 100% 100% !important;
  background-position: center;
  background-repeat: no-repeat !important;
  background: ${(props) =>
    !props.isBackgroundHidden && props.backgroundImage
      ? `url(${props.backgroundImage})`
      : props.backgroundColor};
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
  background-color: ${(props) => props.backgroundColor};
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
