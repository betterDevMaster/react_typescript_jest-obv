import React from 'react'

import Popover from '@material-ui/core/Popover'

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
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      disableRestoreFocus
    >
      <Box p={1}>{sidebarItems[props.mouseHoverIndex].label}</Box>
    </StyledPopover>
  )
}

const StyledPopover = styled(Popover)`
  pointer-events: none;
  .MuiPaper-root {
    background: #e7e7e7;
    margin-left: ${(props) => props.theme.spacing[2]};
  }
`
