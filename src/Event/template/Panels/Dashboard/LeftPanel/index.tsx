import React, {useState} from 'react'
import styled from 'styled-components'
import Slide from '@material-ui/core/Slide'
import {User} from 'auth/user'
import {rgba} from 'lib/color'
import {useToggle} from 'lib/toggle'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import Logo from 'Event/Logo'
import {usePanelsTemplate} from 'Event/template/Panels'
import EmojiList from 'Event/template/Panels/Dashboard/EmojiList'
import LeftPanelConfig from 'Event/template/Panels/Dashboard/LeftPanel/LeftPanelConfig'
import MainNavDesktop from 'Event/template/Panels/Dashboard/MainNav/MainNavDesktop'
import Menu from 'Event/template/Panels/Dashboard/Menu'
import {TOP_BAR_HEIGHT} from 'Event/template/Panels/Page'
import TicketRibbonList from 'Event/template/Panels/Dashboard/TicketRibbonList'

export default function LeftPanel(props: {
  onChangeTab: (tab: number) => void
  user: User
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  const {flag: barConfigVisible, toggle: toggleBarConfig} = useToggle()

  const {leftPanel} = usePanelsTemplate()

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
      >
        <Editable onEdit={toggleBarConfig}>
          <Bar
            backgroundColor={leftPanel.barBackgroundColor}
            aria-label="left panel"
          >
            <StyledMenuIconButton
              active={menuVisible}
              iconColor={leftPanel.barTextColor}
              onClick={toggleMenu}
              aria-label="menu icon button"
            />
            <TicketRibbonList />
          </Bar>
        </Editable>
        <Main>
          <Logo />
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
                  <EmojiList />
                </>
              )}
            </MainContent>
          </Slide>
        </Main>
      </Box>
    </>
  )
}

const Bar = styled.div<{
  backgroundColor: string
}>`
  height: ${TOP_BAR_HEIGHT}px;
  background: ${(props) => props.backgroundColor};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  justify-content: space-between;
`

const Box = styled.div<{
  backgroundColor: string
}>`
  margin: 24px 12px 24px 24px;
  border-radius: 10px;
  background: ${(props) => props.backgroundColor};
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
  margin-left: 24px;
`
