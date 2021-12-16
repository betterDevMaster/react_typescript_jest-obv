import React, {useState} from 'react'
import styled from 'styled-components'

import Slide from '@material-ui/core/Slide'

import {User} from 'auth/user'

import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import EmojiList from 'Event/template/FiftyBlog/Dashboard/EmojiList'
import SizedLogo from 'Event/template/FiftyBlog/Dashboard/SizedLogo'
import LeftPanelConfig from 'Event/template/FiftyBlog/Dashboard/LeftPanel/LeftPanelConfig'
import MainNavDesktop from 'Event/template/FiftyBlog/Dashboard/MainNav/MainNavDesktop'
import Menu from 'Event/template/FiftyBlog/Dashboard/Menu'
import {TOP_BAR_HEIGHT} from 'Event/template/FiftyBlog/Page'
import {useEvent} from 'Event/EventProvider'

import {rgba} from 'lib/color'
import {useToggle} from 'lib/toggle'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import defaultBackground from 'assets/images/background.png'
import BackButton from 'lib/ui/Button/BackButton'

export default function LeftPanel(props: {
  onChangeTab: (tab: number) => void
  user: User
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)
  const {event} = useEvent()
  const background = event.left_panel_background
    ? event.left_panel_background.url
    : defaultBackground
  const {flag: barConfigVisible, toggle: toggleBarConfig} = useToggle()

  const {leftPanel} = useFiftyBlogTemplate()

  const handleChangeTab = (tab: number) => {
    props.onChangeTab(tab)
    setMenuVisible(false)
  }

  return (
    <>
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
        backgroundImage={background}
        isBackgroundHidden={leftPanel.backgroundHidden}
      >
        <Editable onEdit={toggleBarConfig}>
          <Bar aria-label="left panel">
            <StyledMenuIconButton
              active={menuVisible}
              iconColor={leftPanel.barTextColor}
              onClick={toggleMenu}
              aria-label="menu icon button"
            />
          </Bar>
        </Editable>
        <Main>
          <EmojiList />
          <SizedLogo />
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
              {menuVisible ? null : (
                <>
                  <MainNavDesktop />
                </>
              )}
            </MainContent>
          </Slide>
        </Main>
      </Box>
    </>
  )
}

const Bar = styled.div<{}>`
  height: ${TOP_BAR_HEIGHT}px;
  border-top-left-radius: 10px;
  border-top-right-radius: 0;
  display: flex;
  justify-content: space-between;
`

const Box = styled.div<{
  backgroundColor: string
  backgroundImage: string
  isBackgroundHidden: boolean
}>`
  margin: 24px 0 24px 24px;
  ${(props) =>
    props.isBackgroundHidden
      ? `background: ${props.backgroundColor};`
      : `background: url(${props.backgroundImage});`}
  display: flex;
  flex-direction: column;
`

const Main = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 24px 24px 36px;
  flex: 1;

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
  width: 60%;
  margin: 0 auto;
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
  margin-left: 24px;
`
