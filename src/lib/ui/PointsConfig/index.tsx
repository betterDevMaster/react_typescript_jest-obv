import React from 'react'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Header from './Header'
import Controls from './Controls'
import PointConfigAction from './PointConfigAction'
import useActions from './data'

export default function PointsConfig() {
  const {actions, total, perPage, current} = useActions()
  const count = Math.round(total / perPage)

  return (
    <Box>
      <Header />
      <Grid container>
        <Grid item sm={12} md={8}>
          <Controls count={count} page={current} />
          <ConfigContainer>
            <ConfigHeader>Name</ConfigHeader>
            {actions.map((action) => (
              <PointConfigAction
                id={action.id}
                action={action.action}
                pointsEarned={action.pointsEarned}
                maxPerDay={action.maxPerDay}
                maxPerEvent={action.maxPerEvent}
                minInterval={action.minInterval}
              />
            ))}
          </ConfigContainer>
        </Grid>
      </Grid>
    </Box>
  )
}

const ConfigContainer = styled(Box)`
  border: 1px solid #dfdfdf;
`

const ConfigHeader = styled(Box)`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  padding: ${(props) => props.theme.spacing[4]} !important;
`
