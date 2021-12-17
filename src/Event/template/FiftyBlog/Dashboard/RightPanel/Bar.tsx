import {withStyles} from '@material-ui/core/styles'
import styled from 'styled-components'
import {
  useHasMultipleTabs,
  useFiftyBlogTemplate,
} from 'Event/template/FiftyBlog'
import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import MuiTab, {TabProps} from '@material-ui/core/Tab'
import {TOP_BAR_HEIGHT} from 'Event/template/FiftyBlog/Page'
import {useAttendeeVariables} from 'Event'
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
  } = useFiftyBlogTemplate()

  const hasMultipleTabs = useHasMultipleTabs()

  const {currentTab, onChangeTab} = props
  const v = useAttendeeVariables()

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

  return (
    <StyledTabs
      onChange={(_, tabIndex) => onChangeTab(tabIndex)}
      value={currentTab}
      centered
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
