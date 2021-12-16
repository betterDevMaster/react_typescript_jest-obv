import React from 'react'
import styled from 'styled-components'

import Tabs from '@material-ui/core/Tabs'
import MuiTab, {TabProps} from '@material-ui/core/Tab'
import {withStyles} from '@material-ui/core/styles'

import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useAttendeeVariables} from 'Event'
import {
  useHasMultipleTabs,
  useFiftyBlogTemplate,
} from 'Event/template/FiftyBlog'
import {TOP_BAR_HEIGHT} from 'Event/template/FiftyBlog/Page'

import {rgba} from 'lib/color'

export default function Nav(props: {
  currentTab: number
  onChangeTab: (index: number) => void
  'aria-label'?: string
}) {
  const {
    rightPanel,
    homeMenuTitle,
    resourceList: {menuTitle: resourceMenuTitle, isVisible: showingResources},
    leaderboard: {menuTitle: pointsMenuTitle, isVisible: showingPoints},
    speakers: {menuTitle: speakersMenuTitle, isVisible: showingSpeakers},
    sponsors: {menuTitle: sponsorsMenuTitle, isVisible: showingSponsors},
  } = useFiftyBlogTemplate()

  const hasMultipleTabs = useHasMultipleTabs()

  const {currentTab, onChangeTab} = props
  const v = useAttendeeVariables()

  const StyledTabs = withStyles({
    root: {
      minHeight: `${TOP_BAR_HEIGHT}px`,
      backgroundColor: rgba(
        rightPanel.backgroundColor,
        rightPanel.backgroundOpacity,
      ),
      borderTopLeftRadius: '0',
      borderTopRightRadius: '10px',
    },
    flexContainer: {
      justifyContent: 'space-around',
      alignItems: 'center',
      borderBottom: '1px solid #C4C4C4',
    },
    indicator: {
      display: 'flex',
      justifyContent: 'space-around',
      backgroundColor: 'transparent',
      '& > span': {
        maxWidth: 50,
        width: '100%',
        backgroundColor: rightPanel.tabUnderlineColor,
        borderRadius: '10px',
      },
    },
  })((props) => (
    <Tabs {...props} TabIndicatorProps={{children: <span />}} />
  )) as typeof Tabs

  return (
    <StyledTabs
      onChange={(_, tabIndex) => onChangeTab(tabIndex)}
      value={currentTab}
      aria-label={props['aria-label']}
    >
      <Tab
        showing={hasMultipleTabs}
        label={v(homeMenuTitle)}
        aria-label="panels tab home"
      />
      <Tab
        label={v(speakersMenuTitle)}
        aria-label="panels tab speakers"
        showing={showingSpeakers}
      />
      <Tab
        label={v(sponsorsMenuTitle)}
        aria-label="panels tab sponsors"
        showing={showingSponsors}
      />
      <Tab
        label={v(resourceMenuTitle)}
        aria-label="panels tab resources"
        showing={showingResources}
      />
      <Tab
        label={v(pointsMenuTitle)}
        aria-label="panels tab points"
        showing={showingPoints}
      />
    </StyledTabs>
  )
}

function Tab(props: {showing: boolean} & TabProps) {
  const {rightPanel} = useFiftyBlogTemplate()

  const isEditMode = useEditMode()
  const showing = isEditMode ? true : props.showing // always show tab when editing

  return (
    <StyledTab {...props} color={rightPanel.barTextColor} showing={showing} />
  )
}

const StyledTab = styled(
  (props: {showing: boolean; color: string} & TabProps) => {
    const {showing, ...tabProps} = props

    return <MuiTab {...tabProps} />
  },
)`
  ${(props) => (props.showing ? '' : 'display: none;')}
  color: ${(props) => props.color};
  font-weight: bold;
  text-transform: none;
  height: ${TOP_BAR_HEIGHT}px;
  min-width: auto;
`
