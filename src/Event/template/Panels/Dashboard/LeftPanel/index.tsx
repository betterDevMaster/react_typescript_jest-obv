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

export default function LeftPanel(props: {onChangeTab: (tab: number) => void}) {
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
          <Bar backgroundColor={leftPanel.barBackgroundColor}>
            <MenuIconButton
              active={menuVisible}
              iconColor={leftPanel.barTextColor}
              onClick={toggleMenu}
            />
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
            <div>
              {menuVisible ? <Menu onChangeTab={handleChangeTab} /> : null}
            </div>
          </Slide>
          <Slide in={!menuVisible} direction="right" mountOnEnter unmountOnExit>
            <MainContent>
              {menuVisible ? null : (
                <>
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
  height: 65px;
  background: ${(props) => props.backgroundColor};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 24px;
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
`
