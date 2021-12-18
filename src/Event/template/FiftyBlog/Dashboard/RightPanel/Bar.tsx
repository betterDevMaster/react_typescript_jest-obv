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
      backgroundColor: rgba(
        rightPanel.backgroundColor,
        rightPanel.backgroundOpacity,
      ),
      borderTopRightRadius: '10px',
    },
    flexContainer: {
      justifyContent: 'space-around',
      alignItems: 'center',
      borderBottom: '1px solid #C4C4C4',
    },
    indicator: {
      display: 'flex',
      justifyContent: 'center',
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
        isdisplay="visible"
      />
      <Tab
        label={v(speakersMenuTitle)}
        aria-label="panels tab speakers"
        showing={showingSpeakers}
        isdisplay="visible"
      />
      <Tab
        label={v(sponsorsMenuTitle)}
        aria-label="panels tab sponsors"
        showing={showingSponsors}
        isdisplay="visible"
      />
      <Tab
        label={v(resourceMenuTitle)}
        aria-label="panels tab resources"
        showing={showingResources}
        isdisplay="visible"
      />
      <Tab
        label={v(pointsMenuTitle)}
        aria-label="panels tab points"
        showing={showingPoints}
        isdisplay="visible"
      />
      <Tab
        label={v(imageWaterfallTitle)}
        aria-label="panels tab image water fall"
        showing={showingImageWaterfall}
        isdisplay="inVisible"
      />
      <Tab
        label={v(faqsMenuTitle)}
        aria-label="panels tab faqs"
        showing={showingFaqs}
        isdisplay="inVisible"
      />
    </StyledTabs>
  )
}

function Tab(props: {showing: boolean; isdisplay: string} & TabProps) {
  const {rightPanel} = useFiftyBlogTemplate()

  const isEditMode = useEditMode()
  const showing = isEditMode ? true : props.showing // always show tab when editing
  const isdisplay = props.isdisplay // always hide tab
  if (isdisplay === 'inVisible') {
    return null
  }

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
