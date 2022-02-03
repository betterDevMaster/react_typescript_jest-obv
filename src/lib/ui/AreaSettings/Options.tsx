import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Switch from '@material-ui/core/Switch'
import {Header, Label, Description} from 'lib/ui/typography'
import Checkbox from 'lib/ui/Checkbox'

export type OptionsProps = {
  open: boolean
  reassignOnOffline: boolean
  requireApproval: boolean
  joinMultipleDevices: boolean
}

export default function Options(props: OptionsProps) {
  const {open, reassignOnOffline, requireApproval, joinMultipleDevices} = props

  return (
    <Box>
      <FlexBox>
        <StageHeader>Main Stage</StageHeader>
        <OptionsBox>
          <SwitchBox className="left-switch">
            <Switch checked={open} />
            <Label>Open</Label>
          </SwitchBox>
          <SwitchBox>
            <Switch checked={reassignOnOffline} />
            <Label>Re-assign on offline</Label>
          </SwitchBox>
        </OptionsBox>
      </FlexBox>
      <DescriptionBox>
        <Description>
          “Short description of what Event Settings are used for and how they
          work.”
        </Description>
      </DescriptionBox>
      <StyledCheckbox label="Require approval" checked={requireApproval} />
      <StyledCheckbox
        label="User join with multiple devices"
        checked={joinMultipleDevices}
      />
    </Box>
  )
}

const FlexBox = styled(Box)`
  display: flex;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: block;
  }
`

const OptionsBox = styled(Box)`
  display: flex;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    justify-content: space-between;
  }
`

const StageHeader = styled(Header)`
  margin-right: ${(props) => props.theme.spacing[10]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-right: 0 !important;
    margin-bottom: ${(props) => props.theme.spacing[3]} !important;
  }
`

const SwitchBox = styled(Box)`
  display: flex;
  align-items: center;

  &.left-switch {
    margin-right: ${(props) => props.theme.spacing[10]} !important;
    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      margin-right: 0 !important;
    }
  }

  p {
    margin-bottom: ${(props) => props.theme.spacing[1]} !important;
  }
`

const DescriptionBox = styled(Box)`
  max-width: 320px;
  margin-top: ${(props) => props.theme.spacing[3]} !important;
  margin-bottom: ${(props) => props.theme.spacing[5]} !important;
`

const StyledCheckbox = styled(Checkbox)`
  margin-bottom: ${(props) => props.theme.spacing[5]} !important;
`
