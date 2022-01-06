import React from 'react'
import styled from 'styled-components'

import {
  AppBar,
  CssBaseline,
  MenuItem,
  makeStyles,
  Select,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {
  useHasMultipleTabs,
  useNiftyFiftyTemplate,
} from 'Event/template/NiftyFifty'
import Bar from 'Event/template/NiftyFifty/Dashboard/RightPanel/Bar'

const dropdownStyles = makeStyles({
  underline: {
    borderBottom: '0px solid red !important',
    '&:hover': {
      borderBottom: '0px solid rgba(0,0,0,0)',
    },
  },
})

export default function Navbar(props: {
  onChangeTab: (tab: number) => void
  currentTab: number
}) {
  const theme = useTheme()
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'))

  const template = useNiftyFiftyTemplate()
  const {rightPanel} = template
  const {
    homeMenuTitle: homeTitle,
    speakers: {menuTitle: speakerTitle, isVisible: showingSpeakers},
    sponsors: {menuTitle: sponsorsTitle, isVisible: showingSponsors},
    resourceList: {menuTitle: resourcesTitle, isVisible: showingResources},
    leaderboard: {menuTitle: pointsTitle, isVisible: showingPoints},
    imageWaterfall: {
      menuTitle: imageWaterfallTitle,
      isVisible: showingImageWaterfall,
    },
    faq: {menuTitle: faqsTitle, isVisible: showingFaqs},
  } = template
  const hasMultipleTabs = useHasMultipleTabs()
  const isEditMode = useEditMode()

  const ddnSt = dropdownStyles()

  const handleChange = (event: any) => {
    props.onChangeTab(event.target.value)
  }

  return (
    <Paper position="static" textcolor={rightPanel.textColor}>
      <CssBaseline />
      <Box>
        {isXSMobile ? (
          <StyledSelect
            className={ddnSt.underline}
            value={props.currentTab}
            onChange={handleChange}
            disableUnderline
            IconComponent={() => <KeyboardArrowDownIcon />}
          >
            {(isEditMode || hasMultipleTabs) && (
              <MenuItem value={0}>{homeTitle}</MenuItem>
            )}
            {(isEditMode || showingSpeakers) && (
              <MenuItem value={1}>{speakerTitle}</MenuItem>
            )}
            {(isEditMode || showingSponsors) && (
              <MenuItem value={2}>{sponsorsTitle}</MenuItem>
            )}
            {(isEditMode || showingResources) && (
              <MenuItem value={3}>{resourcesTitle}</MenuItem>
            )}
            {(isEditMode || showingPoints) && (
              <MenuItem value={4}>{pointsTitle}</MenuItem>
            )}
            {(isEditMode || showingImageWaterfall) && (
              <MenuItem value={5}>{imageWaterfallTitle}</MenuItem>
            )}
            {(isEditMode || showingFaqs) && (
              <MenuItem value={6}>{faqsTitle}</MenuItem>
            )}
          </StyledSelect>
        ) : (
          <Bar
            currentTab={0}
            onChangeTab={props.onChangeTab}
            aria-label="panels right panel bar"
          />
        )}
      </Box>
    </Paper>
  )
}

const Paper = styled(AppBar)<{
  textcolor: string
}>`
  background-color: transparent;
  box-shadow: none;
  color: ${(props) => props.textcolor};
`
const Box = styled(Toolbar)`
  padding: 0;
  border-bottom: 1px solid #c4c4c4;
`
const StyledSelect = styled(Select)`
  width: 100%;
  padding: 0 ${(props) => props.theme.spacing[4]};
  font-size: 1.5rem;
  div:focus {
    background-color: transparent;
  }
`
