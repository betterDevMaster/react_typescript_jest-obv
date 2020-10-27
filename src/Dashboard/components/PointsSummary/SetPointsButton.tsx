import Button from '@material-ui/core/Button'
import {POINTS_SUMMARY} from 'Dashboard/components/PointsSummary'
import {useUpdateDashboard} from 'Dashboard/state/DashboardProvider'
import {setConfig} from 'editor/state/actions'
import React from 'react'
import {useDispatch} from 'react-redux'

export default function SetPointsButton(props: {className?: string}) {
  const dispatch = useDispatch()
  const updateDashboard = useUpdateDashboard()

  const showPointsConfig = () => {
    updateDashboard({
      points: {
        headerImage: '',
        description: '',
        numPoints: 0,
        unit: '',
        leaderboardUrl: '',
      },
    })
    dispatch(
      setConfig({
        type: POINTS_SUMMARY,
      }),
    )
  }

  return (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="secondary"
      aria-label="set points"
      onClick={showPointsConfig}
      className={props.className}
    >
      Set Points
    </Button>
  )
}
