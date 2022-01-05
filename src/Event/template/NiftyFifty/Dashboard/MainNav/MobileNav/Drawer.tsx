import React, {useState} from 'react'
import styled from 'styled-components'

import {Drawer, IconButton, makeStyles} from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu'
import {
  useHasMultipleTabs,
  useNiftyFiftyTemplate,
} from 'Event/template/NiftyFifty'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useAttendeeVariables} from 'Event'
import {rgba} from 'lib/color'

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    color: 'blue',
    fontSize: '20px',
  },
  icon: {
    color: 'white',
    paddingRight: 0,
  },
}))

export default function DrawerComponent(props: {
  onChangeTab: (tab: number) => void
  onChangeTitle: (title: string) => void
}) {
  const classes = useStyles()
  const {onChangeTab, onChangeTitle} = props
  const [openDrawer, setOpenDrawer] = useState(false)
  const template = useNiftyFiftyTemplate()
  const color = template.leftPanel.menuTextColor || '#FFFFFF'
  const backgroundColor =
    rgba(
      template.leftPanel.barBackgroundColor,
      template.leftPanel.barBackgroundOpacity,
    ) || '#000000'

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

  const changeDrawer = (status: boolean) => {
    setOpenDrawer(status)
  }

  const linkProps = {
    onChangeTab,
    onChangeTitle,
    changeDrawer,
    color,
    openDrawer,
  }

  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box backgroundColor={backgroundColor}>
          <LinkText
            {...linkProps}
            index={0}
            showing={hasMultipleTabs}
            label={homeTitle}
          />
          <LinkText
            {...linkProps}
            index={1}
            showing={showingSpeakers}
            label={speakerTitle}
          />
          <LinkText
            {...linkProps}
            index={2}
            showing={showingSponsors}
            label={sponsorsTitle}
          />
          <LinkText
            {...linkProps}
            index={3}
            showing={showingResources}
            label={resourcesTitle}
          />
          <LinkText
            {...linkProps}
            index={4}
            showing={showingPoints}
            label={pointsTitle}
          />
          <LinkText
            {...linkProps}
            index={5}
            showing={showingImageWaterfall}
            label={imageWaterfallTitle}
          />
          <LinkText
            {...linkProps}
            index={6}
            showing={showingFaqs}
            label={faqsTitle}
          />
        </Box>
      </Drawer>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        className={classes.icon}
      >
        <MenuIcon />
      </IconButton>
    </>
  )
}

function LinkText(props: {
  onChangeTab: (tab: number) => void
  onChangeTitle: (title: string) => void
  changeDrawer: (status: boolean) => void
  label: string
  showing: boolean
  color: string
  openDrawer: boolean
  index: number
}) {
  const {label, color, index, showing} = props

  const isEditMode = useEditMode()
  const v = useAttendeeVariables()

  if (!isEditMode && !showing) {
    return null
  }

  return (
    <TabText
      key={label}
      onClick={() => {
        props.onChangeTab(index)
        props.onChangeTitle(label)
        props.changeDrawer(!props.openDrawer)
      }}
      style={{color}}
      aria-label={`left panel menu ${label} button`}
    >
      {v(label)}
    </TabText>
  )
}
const TabText = styled.span`
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  line-height: 20px;
  cursor: pointer;
  margin-bottom: 20px;
`
const Box = styled.div<{
  backgroundColor: string
}>`
  min-width: 240px;
  display: flex;
  flex-direction: column;
  align=items: center;
  justify-content: center;
  height: 100%;
  background: ${(props) => props.backgroundColor};
  color: rgb(255, 255, 255);
`
