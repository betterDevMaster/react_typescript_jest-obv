import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {useAttendeeVariables} from 'Event'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {PointsSummaryConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/PointsSummary/PointsSummaryConfig'
import Button from '@material-ui/core/Button'
import {RemoveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {useEditSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'
import {Ordered} from 'lib/list'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'
import {HasRules} from 'Event/attendee-rules'

export const POINTS_SUMMARY = 'Points Summary'
export interface PointsSummaryProps extends Ordered, HasRules {
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
  const template = useSimpleBlogTemplate()
  const {sidebar} = template
  const {summary, description} = props
  const v = useAttendeeVariables()
  const isEditMode = useEditMode()

  const content = (
    <>
      <PointsLogo />
      <Box color={sidebar.textColor}>
        <Summary aria-label="points summary" color={sidebar.textColor}>
          {v(summary)}
        </Summary>
        <Description color={sidebar.textColor}>{v(description)}</Description>
      </Box>
    </>
  )

  if (!isEditMode) {
    return <Section>{content}</Section>
  }

  return <Configurable pointsSummary={props}>{content}</Configurable>
}

function Configurable(props: {
  pointsSummary: PointsSummaryProps
  children: React.ReactElement
}) {
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const {remove: removeItem} = useEditSidebarItem()
  const {pointsSummary} = props

  useRemoveIfEmpty(removeItem, pointsSummary)

  return (
    <Section>
      <PointsSummaryConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        points={pointsSummary}
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
      <RemoveButton size="large" showing onClick={removeItem}>
        Remove Points Summary
      </RemoveButton>
      {props.children}
    </Section>
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
