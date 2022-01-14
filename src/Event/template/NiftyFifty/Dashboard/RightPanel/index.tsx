import React from 'react'
import styled from 'styled-components'
import {ThemeProvider} from '@material-ui/core/styles'
import {rgba} from 'lib/color'
import {useToggle} from 'lib/toggle'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import {useTheme} from 'Event/template/NiftyFifty/Page'
import Bar from 'Event/template/NiftyFifty/Dashboard/RightPanel/Bar'
import RightPanelConfig from 'Event/template/NiftyFifty/Dashboard/RightPanel/RightPanelConfig'

export default function RightPanel(props: {
  children: React.ReactElement
  currentTab: number
  onChangeTab: (tab: number) => void
}) {
  const {rightPanel} = useNiftyFiftyTemplate()
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
        <Box
          backgroundColor={rgba(
            rightPanel.backgroundColor,
            rightPanel.backgroundOpacity,
          )}
          textColor={rightPanel.textColor}
        >
          <Editable onEdit={toggleBarConfig}>
            <Bar
              currentTab={props.currentTab}
              onChangeTab={props.onChangeTab}
              aria-label="panels right panel bar"
            />
          </Editable>

          {props.children}
        </Box>
      </ThemeProvider>
    </>
  )
}

const Box = styled.div<{
  backgroundColor: string
  textColor: string
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100vh;

  background: ${(props) => props.backgroundColor};
  position: relative;
  > * {
    color: ${(props) => props.textColor}!important;
  }
`
