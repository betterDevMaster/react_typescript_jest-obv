import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Switch from '@material-ui/core/Switch'
import Accordion from 'lib/ui/Accordion'
import AccordionDetails from 'lib/ui/Accordion/AccordionDetails'
import AccordionSummary from 'lib/ui/Accordion/AccordionSummary'
import Select from 'lib/ui/Select'
import Option from 'lib/ui/Select/Option'
import CounterButtons from 'lib/ui/Counter'
import {Label} from 'lib/ui/typography'
import useActions from './data'

export type PointConfigActionProps = {
  id: string
  action: string
  pointsEarned: number
  maxPerDay: number
  maxPerEvent: number
  minInterval: number
}

export default function PointConfigAction(props: PointConfigActionProps) {
  const {id, action, pointsEarned, maxPerDay, maxPerEvent, minInterval} = props
  const {actions} = useActions()

  return (
    <Accordion id={id}>
      <AccordionSummary expandedIconName="chevron">
        <ActionName>{action}</ActionName>
      </AccordionSummary>
      <StyledAccordionDetails>
        <ConfigFlexBox flexDirection="row">
          <Left>
            <StyledLabel>Platform Action</StyledLabel>
            <Select fullWidth onChange={() => {}}>
              {actions.map((action) => (
                <Option>{action.action}</Option>
              ))}
            </Select>
          </Left>
          <ActiveBox>
            <ActiveLabel>Active</ActiveLabel>
            <Switch />
          </ActiveBox>
        </ConfigFlexBox>
        <ConfigBox>
          <ConfigLabel>Points earned</ConfigLabel>
          <CounterButtons
            current={pointsEarned}
            hasBorder
            onChange={() => {}}
          />
        </ConfigBox>
        <ConfigBox>
          <ConfigLabel>Max per day</ConfigLabel>
          <CounterButtons current={maxPerDay} hasBorder onChange={() => {}} />
        </ConfigBox>
        <ConfigBox>
          <ConfigLabel>Max per event</ConfigLabel>
          <CounterButtons current={maxPerEvent} hasBorder onChange={() => {}} />
        </ConfigBox>
        <ConfigBox>
          <ConfigLabel>Min interval (Minutes)</ConfigLabel>
          <CounterButtons current={minInterval} hasBorder onChange={() => {}} />
        </ConfigBox>
      </StyledAccordionDetails>
    </Accordion>
  )
}

const ActionName = styled(Box)`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
`

const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 0 !important;
  display: block !important;
`

const ConfigBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: ${(props) => `${props.theme.spacing[5]} ${props.theme.spacing[4]}`};
  border-bottom: 1px solid #dfdfdf;
`

const ConfigFlexBox = styled(ConfigBox)`
  display: flex;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: block;
  }
`

const ActiveBox = styled(Box)`
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    display: flex;
    align-items: center;
    margin-top: ${(props) => props.theme.spacing[4]} !important;
  }
`

const Left = styled(Box)`
  min-width: 240px;
  margin-right: ${(props) => props.theme.spacing[16]} !important;
`

const StyledLabel = styled(Label)`
  margin-bottom: ${(props) => props.theme.spacing[3]} !important;
`

const ActiveLabel = styled(StyledLabel)`
  padding-left: ${(props) => props.theme.spacing[2]} !important;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding-left: 0 !important;
    margin-bottom: 0 !important;
  }
`

const ConfigLabel = styled(Label)`
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 18px;
  margin-bottom: ${(props) => props.theme.spacing[4]} !important;
`
