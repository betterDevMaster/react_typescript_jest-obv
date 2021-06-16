import Button from '@material-ui/core/Button'
import {POINTS_SUMMARY} from 'Event/template/SimpleBlog/Dashboard/PointsSummary'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import React from 'react'
import {useDispatch} from 'react-redux'

export const DEFAULT_POINTS_UNIT = 'Points'

export default function SetPointsButton(props: {className?: string}) {
  const dispatch = useDispatch()
  const updateTemplate = useDispatchUpdate()

  const showPointsConfig = () => {
    updateTemplate({
      points: {
        description: '',
        unit: DEFAULT_POINTS_UNIT,
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
