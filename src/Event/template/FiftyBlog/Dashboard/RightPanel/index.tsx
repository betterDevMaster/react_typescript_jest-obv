import React from 'react'
import styled from 'styled-components'
import {ThemeProvider} from '@material-ui/core/styles'
import {rgba} from 'lib/color'
import {useToggle} from 'lib/toggle'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {useTheme} from 'Event/template/FiftyBlog/Page'
import Bar from 'Event/template/FiftyBlog/Dashboard/RightPanel/Bar'
import RightPanelConfig from 'Event/template/FiftyBlog/Dashboard/RightPanel/RightPanelConfig'

export default function RightPanel(props: {
  children: React.ReactElement
  currentTab: number
  onChangeTab: (tab: number) => void
}) {
  const {rightPanel} = useFiftyBlogTemplate()
  const {flag: barConfigVisible, toggle: toggleBarConfig} = useToggle()
  const theme = useTheme(rightPanel.isDarkMode)

  return (
    <>
      <EditModeOnly>
        <RightPanelConfig
          isVisible={barConfigVisible}
          onClose={toggleBarConfig}
        />
      </EditModeOnly>
      <ThemeProvider theme={theme}>
        <Box>
          <Editable onEdit={toggleBarConfig}>
            <Bar
              currentTab={props.currentTab}
              onChangeTab={props.onChangeTab}
              aria-label="panels right panel bar"
            />
          </Editable>
          <Body
            backgroundColor={rgba(
              rightPanel.backgroundColor,
              rightPanel.backgroundOpacity,
            )}
            textColor={rightPanel.textColor}
          >
            {props.children}
          </Body>
        </Box>
      </ThemeProvider>
    </>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
`

const Body = styled.div<{
  backgroundColor: string
  textColor: string
}>`
  flex: 1;
  background: ${(props) => props.backgroundColor};
  padding: 40px 70px !important;
  position: relative;
  overflow: auto;

  > * {
    color: ${(props) => props.textColor}!important;
  }
`
