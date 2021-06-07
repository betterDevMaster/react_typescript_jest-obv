import {usePanels} from 'Event/template/Panels'
import React from 'react'
import styled from 'styled-components'

export default function RightPanel(props: {
  children: React.ReactElement
  center?: boolean
}) {
  const {
    template: {checkInPanelColor},
  } = usePanels()

  return (
    <Box backgroundColor={checkInPanelColor} center={props.center}>
      {props.children}
    </Box>
  )
}

const Box = styled.div<{
  backgroundColor: string
  center?: boolean
}>`
  padding: 100px 35px;
  margin: 24px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: ${(props) => (props.center ? 'center' : 'flex-start')};
  background: ${(props) => props.backgroundColor};
`
