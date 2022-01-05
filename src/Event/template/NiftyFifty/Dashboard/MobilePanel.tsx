import React, {useState} from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'

import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import Logo from 'Event/Logo'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import EmojiList from 'Event/template/NiftyFifty/Dashboard/EmojiList'
import MainNavMobile from 'Event/template/NiftyFifty/Dashboard/MainNav/MainNavMobile'
import LeftPanelConfig from 'Event/template/NiftyFifty/Dashboard/LeftPanel/LeftPanelConfig'
import RightPanelConfig from 'Event/template/NiftyFifty/Dashboard/RightPanel/RightPanelConfig'
import Navbar from 'Event/template/NiftyFifty/Dashboard/MainNav/MobileNav/MobilePanelNavbar'

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
  } = useNiftyFiftyTemplate()

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
      <Content onChangeTab={props.onChangeTab}>{props.children}</Content>
    </Box>
  )
}

function Content(props: {
  children: React.ReactElement
  onChangeTab: (tab: number) => void
}) {
  const {rightPanel} = useNiftyFiftyTemplate()
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
      <Navbar onChangeTab={props.onChangeTab} />
      <EditModeOnly>
        <RightPanelIconButton
          onClick={() => setIsEditing({...isEditing, rightPanel: true})}
        />
        <RightPanelConfig
          isVisible={isEditing.rightPanel}
          onClose={() => setIsEditing({...isEditing, rightPanel: false})}
        />
      </EditModeOnly>
      <SecondContent>{props.children}</SecondContent>
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
  background-color: ${(props) => props.backgroundColor};
  position: relative;
  width: 100%;
`

const SecondContent = styled.div`
  padding: ${(props) => props.theme.spacing[6]};
`

const StyledMenuIconButton = styled(MenuIconButton)`
  position: absolute;
  top: 24px;
  left: 4%;
`

const LeftPanelIconButton = styled(EditIconButton)`
  position: absolute;
  top: 14px;
  right: 4%;
`

const RightPanelIconButton = styled(EditIconButton)`
  position: absolute;
  top: 60px;
  right: 4%;
`
