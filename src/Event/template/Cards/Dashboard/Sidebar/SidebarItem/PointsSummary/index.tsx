import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {useAttendeeVariables} from 'Event'
import {useCardsTemplate} from 'Event/template/Cards'
import {useToggle} from 'lib/toggle'
import {PointsSummaryConfig} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/PointsSummary/PointsSummaryConfig'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import Button from '@material-ui/core/Button'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import Section from 'Event/template/Cards/Dashboard/Sidebar/Section'
import {useEditSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'

export const POINTS_SUMMARY = 'Points Summary'
export interface PointsSummaryProps {
  type: typeof POINTS_SUMMARY
  description: string
  summary?: string
}

export const createPointsSummary = (): PointsSummaryProps => ({
  type: POINTS_SUMMARY,
  description: '',
  summary: '',
})

export default function PointsSummary(props: PointsSummaryProps) {
  const {sidebar} = useCardsTemplate()
  const {summary, description} = props
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <Section>
      <EditModeOnly>
        <PointsSummaryConfig
          isVisible={configVisible}
          onClose={toggleConfig}
          points={props}
        />
        <EditButton
          onClick={toggleConfig}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          aria-label="edit points summary"
        >
          Edit Points Summary
        </EditButton>
        <RemovePointsSummarybutton />
      </EditModeOnly>
      <PointsLogo />
      <Box color={sidebar.textColor}>
        <Summary aria-label="points summary" color={sidebar.textColor}>
          {v(summary)}
        </Summary>
        <Description color={sidebar.textColor}>{v(description)}</Description>
      </Box>
    </Section>
  )
}

function RemovePointsSummarybutton() {
  const {remove: removeItem} = useEditSidebarItem()
  return (
    <RemoveButton size="large" showing onClick={removeItem}>
      Remove Points Summary
    </RemoveButton>
  )
}

function PointsLogo() {
  const {event} = useEvent()
  const logo = event.points_summary_logo ? event.points_summary_logo.url : ''
  if (!event.points_summary_logo) {
    return null
  }
  return <HeaderImage src={logo} alt="Points Image" />
}

const Box = styled.div<{color: string}>`
  color: ${(props) => props.color};
`

const HeaderImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const Container = React.forwardRef<
  HTMLDivElement,
  {
    className?: string
    children: string
    'aria-label'?: string
  }
>((props, ref) => {
  return (
    <div
      className={`ck-content ${props.className}`}
      ref={ref}
      aria-label={props['aria-label']}
      dangerouslySetInnerHTML={{
        __html: props.children,
      }}
    />
  )
})

const Summary = styled(Container)<{
  color: string
}>`
  color: ${(props) => props.color};
  font-weight: bold;
  display: block;
  margin-bottom: ${(props) => props.theme.spacing[8]};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    text-align: center;
  }

  a {
    color: ${(props) => props.color} !important;
  }
`

const Description = styled(Container)<{
  color: string
}>`
  color: ${(props) => props.color};

  a {
    color: ${(props) => props.color} !important;
  }
`

const EditButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`
