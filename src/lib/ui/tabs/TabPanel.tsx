import Box from '@material-ui/core/Box'
import React from 'react'

export default function TabPanel(props: {
  children: React.ReactElement | React.ReactElement[]
  index: number
  currentIndex: number
  render?: boolean
}) {
  /**
   * By setting the render prop we can toggle whether
   * to actually render the child component, and
   * only set hidden.
   */
  const isVisible = props.index === props.currentIndex
  if (!isVisible && !props.render) {
    return null
  }

  return (
    <Box py={3} role="tabpanel" hidden={!isVisible}>
      {props.children}
    </Box>
  )
}
