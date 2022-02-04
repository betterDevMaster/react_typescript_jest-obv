import React from 'react'
import styled from 'styled-components'

import {makeStyles, useTheme, useMediaQuery} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Toolbar from '@material-ui/core/Toolbar'

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
  const {currentTab, onChangeTab} = props
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
    onChangeTab(event.target.value)
  }

  return (
    <Paper position="static" textcolor={rightPanel.textColor}>
      <Content>
        <CssBaseline />
        <Box>
          {isXSMobile ? (
            <StyledSelect
              className={ddnSt.underline}
              value={currentTab}
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
              currentTab={currentTab}
              onChangeTab={onChangeTab}
              aria-label="panels right panel bar"
            />
          )}
        </Box>
      </Content>
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
const Content = styled.div`
  width: 90%;
  margin: auto;
  border-bottom: 1px solid #131d34;
`
const Box = styled(Toolbar)`
  width: 100%;
  padding: 0;
`
const StyledSelect = styled(Select)`
  width: 100%;
  font-size: 1.5rem;
  div:focus {
    background-color: transparent;
  }
`
