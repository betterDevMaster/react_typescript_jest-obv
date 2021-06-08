import styled from 'styled-components'
import React from 'react'
import {usePanels} from 'Event/template/Panels'
import {rgba} from 'lib/color'
import {useToggle} from 'lib/toggle'
import Bar from 'Event/template/Panels/Dashboard/RightPanel/Bar'
import RightPanelConfig from 'Event/template/Panels/Dashboard/RightPanel/RightPanelConfig'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useTheme} from 'Event/template/Panels/Page'
import {ThemeProvider} from '@material-ui/core/styles'

export default function RightPanel(props: {
  children: React.ReactElement
  currentTab: number
  onChangeTab: (tab: number) => void
}) {
  const {
    template: {rightPanel},
  } = usePanels()
  const {flag: barConfigVisible, toggle: toggleBarConfig} = useToggle()
  const theme = useTheme(rightPanel.isDarkMode)

  return (
    <>
      <RightPanelConfig
        isVisible={barConfigVisible}
        onClose={toggleBarConfig}
      />
      <ThemeProvider theme={theme}>
        <Box>
          <Editable onEdit={toggleBarConfig}>
            <Bar
              currentTab={props.currentTab}
              onChangeTab={props.onChangeTab}
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
  margin: 24px 24px 24px 12px;
  display: flex;
  flex-direction: column;
`

const Body = styled.div<{
  backgroundColor: string
  textColor: string
}>`
  flex: 1;
  background: ${(props) => props.backgroundColor};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 40px 70px !important;
  position: relative;
  overflow: auto;

  > * {
    color: ${(props) => props.textColor}!important;
  }
`
