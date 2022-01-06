import React from 'react'
import styled from 'styled-components'
import {
  useHasMultipleTabs,
  useNiftyFiftyTemplate,
} from 'Event/template/NiftyFifty'

import {makeStyles, Tabs} from '@material-ui/core'
import MuiTab, {TabProps} from '@material-ui/core/Tab'

import {useAttendeeVariables} from 'Event'
import {TOP_BAR_HEIGHT} from 'Event/template/NiftyFifty/Page'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

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
    imageWaterfall: {
      menuTitle: imageWaterfallTitle,
      isVisible: showingImageWaterfall,
    },
    faq: {menuTitle: faqsMenuTitle, isVisible: showingFaqs},
  } = useNiftyFiftyTemplate()
  const hasMultipleTabs = useHasMultipleTabs()

  const {currentTab, onChangeTab} = props
  const v = useAttendeeVariables()

  const useTabStyles = makeStyles({
    root: {
      justifyContent: 'center',
      borderBottom: '1px solid #C4C4C4',
      width: '100%',
    },
    scroller: {
      flexGrow: 0,
    },
    indicator: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      '& > span': {
        maxWidth: 50,
        width: '100%',
        backgroundColor: rightPanel.tabUnderlineColor,
        borderRadius: '10px',
      },
    },
  })
  const classes = useTabStyles()

  return (
    <Tabs
      classes={{
        root: classes.root,
        scroller: classes.scroller,
        indicator: classes.indicator,
      }}
      onChange={(_, tabIndex) => onChangeTab(tabIndex)}
      value={currentTab}
      aria-label={props['aria-label']}
      variant="scrollable"
      scrollButtons="auto"
      TabIndicatorProps={{children: <span />}}
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
      <Tab
        label={v(imageWaterfallTitle)}
        aria-label="panels tab image water fall"
        showing={showingImageWaterfall}
      />
      <Tab
        label={v(faqsMenuTitle)}
        aria-label="panels tab faqs"
        showing={showingFaqs}
      />
    </Tabs>
  )
}

function Tab(props: {showing: boolean} & TabProps) {
  const {rightPanel} = useNiftyFiftyTemplate()

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
