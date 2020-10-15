import TextField from '@material-ui/core/TextField'
import {Points} from 'Dashboard/components/PointsSummary'
import {setComponent, setDashboard} from 'Dashboard/edit/state/actions'
import {onChangeStringHandler} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import styled from 'styled-components'

export default function PointsSummaryConfig() {
  const points = useSelector((state: RootState) => state.dashboardEditor.points)
  const dispatch = useDispatch()

  if (!points) {
    throw new Error('Missing points; was it set via edit?')
  }

  const update = <T extends keyof Points>(key: T) => (value: Points[T]) => {
    dispatch(
      setDashboard({
        points: {
          ...points,
          [key]: value,
        },
      }),
    )
  }

  const removePoints = () => {
    dispatch(setComponent(null))

    dispatch(
      setDashboard({
        points: null,
      }),
    )
  }

  return (
    <>
      <TextField
        value={points.headerImage}
        label="Image"
        fullWidth
        onChange={onChangeStringHandler(update('headerImage'))}
        inputProps={{
          'aria-label': 'edit header image',
        }}
      />
      <TextField
        value={points.description}
        label="Description"
        multiline
        rows={4}
        fullWidth
        onChange={onChangeStringHandler(update('description'))}
        inputProps={{
          'aria-label': 'points description',
        }}
      />
      <TextField
        value={points.unit}
        label="Unit"
        fullWidth
        onChange={onChangeStringHandler(update('unit'))}
        inputProps={{
          'aria-label': 'points unit',
        }}
      />
      <TextField
        value={points.leaderboardUrl}
        label="Leaderboard URL"
        fullWidth
        onChange={onChangeStringHandler(update('leaderboardUrl'))}
        inputProps={{
          'aria-label': 'points leaderboard url',
        }}
      />
      <RemovePointsButton
        fullWidth
        variant="outlined"
        aria-label="remove points"
        onClick={removePoints}
      >
        REMOVE POINTS
      </RemovePointsButton>
    </>
  )
}

const RemovePointsButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[2]} !important;
  margin-bottom: ${(props) => props.theme.spacing[3]} !important;
`
