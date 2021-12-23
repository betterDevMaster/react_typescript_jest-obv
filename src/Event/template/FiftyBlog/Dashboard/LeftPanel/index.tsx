import React, {useState} from 'react'
import styled from 'styled-components'
import Slide from '@material-ui/core/Slide'
import {User} from 'auth/user'

import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import Logo from 'Event/Logo'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import EmojiList from 'Event/template/FiftyBlog/Dashboard/EmojiList'
import LeftPanelConfig from 'Event/template/FiftyBlog/Dashboard/LeftPanel/LeftPanelConfig'
import MainNavDesktop from 'Event/template/FiftyBlog/Dashboard/MainNav/MainNavDesktop'
import Menu from 'Event/template/FiftyBlog/Dashboard/Menu'

import {rgba} from 'lib/color'
import {useToggle} from 'lib/toggle'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'

import defaultLogo from 'assets/images/logo.png'
import defaultBackground from 'assets/images/background.png'

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
  } = useFiftyBlogTemplate()
  const background = dashboardBackground
    ? dashboardBackground
    : defaultBackground
  const logo = dashboardLogo ? dashboardLogo : defaultLogo

  const handleChangeTab = (tab: number) => {
    props.onChangeTab(tab)
    setMenuVisible(false)
  }

  return (
    <>
      <EditModeOnly>
        <LeftPanelConfig
          isMobile={true}
          isVisible={barConfigVisible}
          onClose={toggleBarConfig}
        />
      </EditModeOnly>
      <Box
        backgroundColor={rgba(
          leftPanel.backgroundColor,
          leftPanel.backgroundOpacity,
        )}
        backgroundImage={background}
        isBackgroundHidden={dashboardBackgroundProps.hidden}
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
            </MainContent>
          </Slide>
        </Main>
      </Box>
    </>
  )
}

const Bar = styled.div<{
  isMenuVisible: boolean
}>`
  margin: ${(props) => (!props.isMenuVisible ? '1.5rem' : 0)};
  display: flex;
  justify-content: space-between;
`

const Box = styled.div<{
  backgroundColor: string
  backgroundImage: string
  isBackgroundHidden: boolean
}>`
  margin: 24px 0 24px 24px;
  padding: 1.5rem;
  border-top-left-radius: 10px;
  ${(props) =>
    props.isBackgroundHidden
      ? `background: ${props.backgroundColor};`
      : `background: url(${props.backgroundImage});`}
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  display: flex;
  flex-direction: column;
`

const Top = styled.div`
  padding: 24px 24px 36px;
`

const Main = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  padding: 2rem 7rem;

  /**
   * Hide overflow to make menu sliding in/out disappear at panel edge,
   * as well as avoid any jumpiness from the transition.
   */
  overflow: hidden;
`

const MainContent = styled.div<{
  visible: boolean
}>`
  flex: ${(props) => (props.visible ? 1 : 0)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  /**
  Allow buttons to scroll if required
  */
  overflow-y: hidden;
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
