import TextField from '@material-ui/core/TextField'
import {Points, POINTS_SUMMARY} from 'Event/Dashboard/components/PointsSummary'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import {onChangeStringHandler} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import React from 'react'
import styled from 'styled-components'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'

export type PointsSummaryConfig = {
  type: typeof POINTS_SUMMARY
}

export function PointsSummaryConfig() {
  const {points} = useTemplate()
  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()
  const {event} = useEvent()

  const update = <T extends keyof Points>(key: T) => (value: Points[T]) => {
    const updated = updatePoints(key, value, points)

    updateTemplate({
      points: updated,
    })
  }

  const removePoints = () => {
    closeConfig()
    updateTemplate({points: null})
  }

  return (
    <>
      <EventImageUpload
        label="Points Logo"
        property="points_summary_logo"
        current={event.points_summary_logo?.url}
      />
      <TextField
        value={points?.description || ''}
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
        value={points?.unit || ''}
        label="Unit"
        fullWidth
        onChange={onChangeStringHandler(update('unit'))}
        inputProps={{
          'aria-label': 'points unit',
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

function updatePoints<T extends keyof Points>(
  key: T,
  value: Points[T],
  points: Points | null,
): Points {
  if (!points) {
    return {
      description: '',
      unit: '',
      [key]: value,
    }
  }

  return {
    ...points,
    [key]: value,
  }
}

const RemovePointsButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[2]} !important;
  margin-bottom: ${(props) => props.theme.spacing[3]} !important;
`
