import Button from '@material-ui/core/Button'
import {POINTS_SUMMARY} from 'Event/Dashboard/components/PointsSummary'
import {useUpdateTemplate} from 'Event/TemplateProvider'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import React from 'react'
import {useDispatch} from 'react-redux'

export default function SetPointsButton(props: {className?: string}) {
  const dispatch = useDispatch()
  const updateTemplate = useUpdateTemplate()

  const showPointsConfig = () => {
    updateTemplate({
      points: {
        description: '',
        unit: 'Points',
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
