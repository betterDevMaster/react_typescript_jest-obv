import styled from 'styled-components'
import grey from '@material-ui/core/colors/grey'
import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'
import {appRoot} from 'App'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {ObvioEvent} from 'Event'
import {useEventRoutes} from 'organization/Event/EventRoutes'

export default function Card(props: {event: ObvioEvent}) {
  const label = `view ${props.event.name}`
  const routes = useEventRoutes(props.event)

  return (
    <RelativeLink to={routes.root} disableStyles aria-label={label}>
      <Box>
        <Name>{props.event.name}</Name>
        <URL variant="caption">
          {props.event.slug}.{appRoot}
        </URL>
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
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 180px;

  &:hover {
    background: ${grey[200]};
  }
`

const Name = styled.h5`
  margin: 0;
  font-size: 28px;
`

const URL = withStyles({
  root: {
    display: 'block',
    marginTop: spacing[1],
  },
})(Typography)
