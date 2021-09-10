import {RelativeLink} from 'lib/ui/link/RelativeLink'
import styled from 'styled-components'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import React from 'react'
import grey from '@material-ui/core/colors/grey'
import {Area} from 'organization/Event/AreasProvider'
import {areaRoutes} from 'organization/Event/Area/AreaRoutes'
import {useNumAttendees} from 'organization/Event/Area'

export default function Card(props: {area: Area}) {
  const {area} = props
  const label = `view ${area.name} area`
  const eventRoutes = useEventRoutes()
  const routes = areaRoutes({area, eventRoutes})
  const numAttendeees = useNumAttendees(area)

  return (
    <RelativeLink to={routes.root} disableStyles aria-label={label}>
      <Box>
        <span>{area.name}</span>
        <span>{numAttendeees}</span>
      </Box>
    </RelativeLink>
  )
}

const Box = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: ${(props) => props.theme.spacing[5]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  border-radius: 6px;
  display: flex;
  justify-content: space-between;

  &:hover {
    background: ${grey[200]};
  }
`
