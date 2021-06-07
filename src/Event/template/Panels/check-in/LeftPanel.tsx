import StepIndicator from 'Event/template/Panels/check-in/StepIndicator'
import styled from 'styled-components'
import React from 'react'
import Logo from 'Event/Logo'
import {Step} from 'Event/template/Panels/GeneralConfig/CheckInConfig'

export default function LeftPanel(props: {step: Step}) {
  return (
    <Box>
      <div>
        <Menu />
        <Logo />
        <StepIndicator step={props.step} />
      </div>
    </Box>
  )
}

function Menu() {
  return null
}

const Box = styled.div`
  display: flex;
  justify-content: center;
  margin: 24px;
  padding: 40px;
`
