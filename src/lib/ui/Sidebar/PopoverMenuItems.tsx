import React from 'react'

import Popover from '@material-ui/core/Popover'
import {Text} from 'lib/ui/typography'

import styled from 'styled-components'
import {useSidebarLists} from 'lib/ui/Sidebar'
import Box from 'lib/ui/Box'

/**
 * It will show up the menu items when the mouse hovers any item in collapsed mode on Desktop View.
 */
export default function PopoverMenuItems(props: {
  anchorEl: HTMLElement | null
  mouseHoverIndex: number
  show: boolean
}) {
  const sidebarItems = useSidebarLists()

  if (props.mouseHoverIndex < 0 || props.show === false) {
    return null
  }

  return (
    <StyledPopover
      open={Boolean(props.anchorEl)}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      disableRestoreFocus
    >
      <Box p={1}>
        <Text>{sidebarItems[props.mouseHoverIndex].label}</Text>
      </Box>
    </StyledPopover>
  )
}

const StyledPopover = styled(Popover)`
  pointer-events: none;
`
