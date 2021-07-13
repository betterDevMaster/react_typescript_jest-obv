import SetPointsButton from 'Event/template/SimpleBlog/Dashboard/PointsSummary/SetPointsButton'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {useEvent} from 'Event/EventProvider'
import {useVariables} from 'Event'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {PointsSummaryConfig} from 'Event/template/SimpleBlog/Dashboard/PointsSummary/PointsSummaryConfig'
import {withDefault} from 'lib/template'

export type Points = {
  description: string
  unit: string
  summary?: string
}

export const DEFAULT_POINTS_SUMMARY =
  "You've earned {{leaderboard_points}} {{points_unit}}!"

export default function PointsSummary() {
  const {template} = useSimpleBlog()
  const {points: settings, sidebar} = template
  const v = useVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  if (!settings) {
    return (
      <EditModeOnly>
        <PointsSummaryConfig isVisible={configVisible} onClose={toggleConfig} />
        <StyledSetPointsButton onClick={toggleConfig} />
      </EditModeOnly>
    )
  }

  return (
    <>
      <PointsSummaryConfig isVisible={configVisible} onClose={toggleConfig} />
      <Section>
        <Editable onEdit={toggleConfig}>
          <>
            <PointsLogo />
            <Box color={sidebar.textColor}>
              <Summary aria-label="points summary" color={sidebar.textColor}>
                {v(withDefault(DEFAULT_POINTS_SUMMARY, settings.summary))}
              </Summary>
              <Description color={sidebar.textColor}>
                {v(settings.description)}
              </Description>
            </Box>
          </>
        </Editable>
      </Section>
    </>
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

const StyledSetPointsButton = styled(SetPointsButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
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
