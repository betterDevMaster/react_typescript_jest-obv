import React, {useState} from 'react'
import styled from 'styled-components'

import {User} from 'auth/user'

import Logo from 'Event/Logo'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import Menu from 'Event/template/FiftyBlog/Dashboard/Menu'
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
        <LogoBox>
          <EmojiList />
          <Logo
            src={logo}
            hidden={template.dashboardLogoProps.hidden}
            size={template.dashboardLogoProps.size}
          />
        </LogoBox>
        <Top>
          <MainNavMobile />
        </Top>
      </Container>
      <div className="relative">
        <RightPanelIconButton
          onClick={() => setIsEditing({...isEditing, rightPanel: true})}
        />
        <RightPanelConfig
          isMobile={true}
          isVisible={isEditing.rightPanel}
          onClose={() => setIsEditing({...isEditing, rightPanel: false})}
        />
        <Content
          menuVisible={menuVisible}
          onChangeTab={handleChangeTab}
          user={props.user}
        >
          {props.children}
        </Content>
      </div>
    </Box>
  )
}

function Content(props: {
  menuVisible: boolean
  children: React.ReactElement
  onChangeTab: (tab: number) => void
  user: User
}) {
  const template = useFiftyBlogTemplate()

  if (props.menuVisible) {
    return <Menu onChangeTab={props.onChangeTab} user={props.user} />
  }

  return (
    <>
      <Panel
        backgroundColor={rgba(
          template.rightPanel.backgroundColor,
          template.rightPanel.backgroundOpacity,
        )}
      >
        {props.children}
      </Panel>
    </>
  )
}

const Box = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  overflow: auto;
`

const Container = styled.div<{
  backgroundColor: string
  backgroundImage: string
  isBackgroundHidden: boolean
}>`
  padding: ${(props) => props.theme.spacing[6]}
    ${(props) => props.theme.spacing[6]} ${(props) => props.theme.spacing[9]};
  border-radius: 10px;
  ${(props) =>
    props.isBackgroundHidden
      ? `background: ${props.backgroundColor};`
      : `background: url(${props.backgroundImage});`}
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: column;
`

const LogoBox = styled.div`
  max-width: 260px;
  max-height: 260px;
  padding-top: ${(props) => props.theme.spacing[5]};
`

const Panel = styled.div<{
  backgroundColor: string
}>`
  flex: 1;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: ${(props) => props.theme.spacing[6]}
    ${(props) => props.theme.spacing[6]} ${(props) => props.theme.spacing[9]};
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

const Top = styled.div`
  width: 100%;
  padding: 0 ${(props) => props.theme.spacing[10]};
`
