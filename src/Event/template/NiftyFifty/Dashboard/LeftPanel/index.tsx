import React, {useState} from 'react'
import styled from 'styled-components'
import Slide from '@material-ui/core/Slide'
import {User} from 'auth/user'

import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import Logo from 'Event/Logo'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import EmojiList from 'Event/template/NiftyFifty/Dashboard/EmojiList'
import LeftPanelConfig from 'Event/template/NiftyFifty/Dashboard/LeftPanel/LeftPanelConfig'
import MainNavDesktop from 'Event/template/NiftyFifty/Dashboard/MainNav/MainNavDesktop'
import Menu from 'Event/template/NiftyFifty/Dashboard/Menu'
import CountDownTimers from 'Event/template/NiftyFifty/Dashboard/CountDownTimers'

import {rgba} from 'lib/color'
import {useToggle} from 'lib/toggle'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'

import defaultLogo from 'assets/images/logo.png'

export default function LeftPanel(props: {
  onChangeTab: (tab: number) => void
  user: User
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const isEditMode = useEditMode()

  const {flag: barConfigVisible, toggle: toggleBarConfig} = useToggle()

  const {
    leftPanel,
    dashboardBackground,
    dashboardLogo,
    dashboardBackgroundProps,
    dashboardLogoProps,
  } = useNiftyFiftyTemplate()
  const background = dashboardBackground ? dashboardBackground : null
  const logo = dashboardLogo ? dashboardLogo : defaultLogo

  const handleChangeTab = (tab: number) => {
    props.onChangeTab(tab)
    setMenuVisible(false)
  }

  return (
    <Paper
      menuBackgroundColor={rgba(
        leftPanel.barBackgroundColor,
        leftPanel.barBackgroundOpacity,
      )}
      backgroundColor={rgba(
        leftPanel.backgroundColor,
        leftPanel.backgroundOpacity,
      )}
      backgroundImage={background}
      isBackgroundHidden={dashboardBackgroundProps.hidden}
      isMenuVisible={menuVisible}
    >
      <EditModeOnly>
        <LeftPanelConfig
          isVisible={barConfigVisible}
          onClose={toggleBarConfig}
        />
      </EditModeOnly>
      <Box
        backgroundColor={rgba(
          leftPanel.backgroundColor,
          leftPanel.backgroundOpacity,
        )}
      >
        <Editable onEdit={toggleBarConfig}>
          <Bar isMenuVisible={isEditMode} aria-label="left panel">
            <StyledMenuIconButton
              active={menuVisible}
              iconColor={leftPanel.barTextColor}
              onClick={toggleMenu}
              aria-label="menu icon button"
            />
          </Bar>
        </Editable>
        <Top>
          <EmojiList />
          <Logo
            src={logo}
            hidden={dashboardLogoProps.hidden}
            size={dashboardLogoProps.size}
          />
        </Top>
        <Main>
          {/*
              Menu slide-in-out animation. Need to set content to null to avoid
              the exiting content from having a height, and the divs
              stacking while animating.
          */}
          <Slide in={menuVisible} direction="left" mountOnEnter unmountOnExit>
            <MenuBox visible={menuVisible}>
              {menuVisible ? (
                <Menu onChangeTab={handleChangeTab} user={props.user} />
              ) : null}
            </MenuBox>
          </Slide>
          <Slide in={!menuVisible} direction="right" mountOnEnter unmountOnExit>
            <MainContent visible={!menuVisible}>
              {menuVisible ? null : <MainNavDesktop />}
              <CountDownTimers />
            </MainContent>
          </Slide>
        </Main>
      </Box>
    </Paper>
  )
}

const Bar = styled.div<{
  isMenuVisible: boolean
}>`
  display: flex;
  justify-content: space-between;
`

const Paper = styled.div<{
  backgroundColor: string
  backgroundImage: any
  isBackgroundHidden: boolean
  menuBackgroundColor: string
  isMenuVisible: boolean
}>`
  background: ${(props) =>
    props.isMenuVisible
      ? props.menuBackgroundColor
      : !props.isBackgroundHidden && props.backgroundImage
      ? `url(${props.backgroundImage})`
      : props.backgroundColor};
  background-size: cover !important;
  background-position: center;
  background-repeat: no-repeat !important;
  width: 100%;
  height: 100%;
`

const Box = styled.div<{
  backgroundColor: string
}>`
  background: ${(props) => props.backgroundColor};
  background-size: cover !important;
  background-position: center;
  background-repeat: no-repeat !important;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[6]};
`

const Top = styled.div`
  padding: ${(props) => props.theme.spacing[6]};
`

const Main = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[0]}
    ${(props) => props.theme.spacing[6]};
`

const MainContent = styled.div<{
  visible: boolean
}>`
  flex: ${(props) => (props.visible ? 1 : 0)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`

const MenuBox = styled.div<{
  visible: boolean
}>`
  flex: ${(props) => (props.visible ? 1 : 0)};
  display: flex;
`

const StyledMenuIconButton = styled(MenuIconButton)`
  width: 30px;
  height: 30px;
  top: 0;
  transform: none;
`
