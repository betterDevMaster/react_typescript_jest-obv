import Logo from 'Event/Logo'
import styled from 'styled-components'
import React, {useState} from 'react'
import {usePanels} from 'Event/template/Panels'
import {MenuIconButton} from 'lib/ui/IconButton/MenuIconButton'
import MainNav from 'Event/template/Panels/Dashboard/MainNav'
import Menu from 'Event/template/Panels/Dashboard/Menu'
import EmojiList from 'Event/template/Panels/Dashboard/EmojiList'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import LeftPanelConfig from 'Event/template/Panels/Dashboard/LeftPanel/LeftPanelConfig'
import {useToggle} from 'lib/toggle'
import {rgba} from 'lib/color'
import Slide from '@material-ui/core/Slide'
import {TOP_BAR_HEIGHT} from 'Event/template/Panels/Page'
import {User} from 'auth/user'
import TicketRibbonList from 'Event/template/Panels/Dashboard/TicketRibbonList'

export default function LeftPanel(props: {
  onChangeTab: (tab: number) => void
  user: User
}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible(!menuVisible)

  const {flag: barConfigVisible, toggle: toggleBarConfig} = useToggle()

  const {
    template: {leftPanel},
  } = usePanels()

  const handleChangeTab = (tab: number) => {
    props.onChangeTab(tab)
    setMenuVisible(false)
  }

  return (
    <>
      <LeftPanelConfig isVisible={barConfigVisible} onClose={toggleBarConfig} />
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
            <MenuBox>
              {menuVisible ? (
                <Menu onChangeTab={handleChangeTab} user={props.user} />
              ) : null}
            </MenuBox>
          </Slide>
          <Slide in={!menuVisible} direction="right" mountOnEnter unmountOnExit>
            <MainContent>
              {menuVisible ? null : (
                <>
                  <div>{/* Spacer used to center buttons */}</div>
                  <MainNav />
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
  padding: 24px;
  flex: 1;
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`

const MenuBox = styled.div`
  flex: 1;
  display: flex;
`

const StyledMenuIconButton = styled(MenuIconButton)`
  margin-left: 24px;
`
