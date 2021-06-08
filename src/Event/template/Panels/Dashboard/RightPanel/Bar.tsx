import {withStyles} from '@material-ui/core/styles'
import {usePanels} from 'Event/template/Panels'
import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import {Tab} from '@material-ui/core'
import {TOP_BAR_HEIGHT} from 'Event/template/Panels/Page'

export default function Nav(props: {
  currentTab: number
  onChangeTab: (index: number) => void
}) {
  const {
    template: {rightPanel},
  } = usePanels()
  const {currentTab, onChangeTab} = props

  const StyledTabs = withStyles({
    root: {
      minHeight: `${TOP_BAR_HEIGHT}px`,
      backgroundColor: rightPanel.barBackgroundColor,
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
    },
    indicator: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      bottom: '16px',
      '& > span': {
        maxWidth: 30,
        width: '100%',
        backgroundColor: rightPanel.tabUnderlineColor,
        borderRadius: '10px',
      },
    },
  })((props) => (
    <Tabs {...props} TabIndicatorProps={{children: <span />}} />
  )) as typeof Tabs

  const StyledTab = withStyles((theme) => ({
    root: {
      color: rightPanel.barTextColor,
      fontWeight: 'bold',
      textTransform: 'none',
      height: `${TOP_BAR_HEIGHT}px`,
    },
  }))((props) => <Tab disableRipple {...props} />) as typeof Tab

  return (
    <StyledTabs
      onChange={(_, tabIndex) => onChangeTab(tabIndex)}
      value={currentTab}
      centered
    >
      <StyledTab label="Home" />
      <StyledTab label="Speakers" />
      <StyledTab label="Resources" />
      <StyledTab label="Points" />
    </StyledTabs>
  )
}
