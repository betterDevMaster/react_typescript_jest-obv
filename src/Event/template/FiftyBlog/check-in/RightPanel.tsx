import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {rgba} from 'lib/color'
import React from 'react'
import styled from 'styled-components'

export default function RightPanel(props: {
  children: React.ReactElement
  center?: boolean
}) {
  const template = useFiftyBlogTemplate()
  const {checkInRightPanel} = template

  return (
    <Box
      backgroundColor={rgba(
        checkInRightPanel.backgroundColor,
        checkInRightPanel.backgroundOpacity,
      )}
      textColor={checkInRightPanel.textColor}
      center={props.center}
    >
      {props.children}
    </Box>
  )
}

const Box = styled.div<{
  backgroundColor: string
  textColor: string
  center?: boolean
}>`
  padding: 100px 35px;
  margin: 24px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: ${(props) => (props.center ? 'center' : 'flex-start')};
  background: ${(props) => props.backgroundColor};
  overflow: auto;

  > * {
    color: ${(props) => props.textColor}!important;
  }
`
