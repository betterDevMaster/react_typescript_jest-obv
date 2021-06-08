import React from 'react'
import TextField from '@material-ui/core/TextField'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {Controller, useForm} from 'react-hook-form'
import Button from '@material-ui/core/Button'
import {useUpdate} from 'Event/EventProvider'
import {Panels, usePanels} from 'Event/template/Panels'
import {useToggle} from 'lib/toggle'
import {DEFAULT_POINTS_UNIT} from 'Event/template/SimpleBlog/Dashboard/PointsSummary/SetPointsButton'

export const DEFAULT_TITLE = 'Leaderboard'
export const DEFAULT_DESCRIPTION =
  '<p>{{first name}}, you have earned {{leaderboard_points}} {{points_unit}}, and you are currently {{leaderboard_position}}. Great Job!</p><p><i>The list below is the top 200 point earners! If you don’t see your name listed, there’s still time!</i></p><p><br>&nbsp;</p>'
export const DEFAULT_BACK_TO_DASHBOARD_TEXT = 'Back to Dashboard'
export const DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR = '#000000'

export default function LeaderboardConfig(props: {onComplete?: () => void}) {
  const {template} = usePanels()
  const {leaderboard} = template
  const {register, control, handleSubmit} = useForm()

  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const updateEvent = useUpdate()

  const submit = (data: {
    title: string
    description: string
    points_unit: string
  }) => {
    if (processing) {
      return
    }
    toggleProcessing()

    const existing = template.leaderboard || {}

    const updated: Panels = {
      ...template,
      leaderboard: {
        ...existing,
        title: data.title,
        description: data.description,
      },
      points: {
        unit: data.points_unit,
      },
    }

    updateEvent({template: updated}).finally(() => {
      toggleProcessing()
      props.onComplete && props.onComplete()
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <TextField
        defaultValue={leaderboard?.title || DEFAULT_TITLE}
        name="title"
        label="Title"
        fullWidth
        inputProps={{
          'aria-label': 'set leaderboard page title',
          ref: register({required: 'Title is required'}),
        }}
        disabled={processing}
      />
      <Controller
        name="description"
        control={control}
        defaultValue={leaderboard?.description || DEFAULT_DESCRIPTION}
        rules={{
          required: 'Description is required',
        }}
        render={({value, onChange}) => (
          <TextEditorContainer>
            <TextEditor
              data={value}
              onChange={onChange}
              disabled={processing}
            />
          </TextEditorContainer>
        )}
      />
      <TextField
        defaultValue={template.points?.unit || DEFAULT_POINTS_UNIT}
        name="points_unit"
        label="Points Unit"
        fullWidth
        inputProps={{
          ref: register({required: 'Points unit is required'}),
          'aria-label': 'points unit',
        }}
        disabled={processing}
      />
      <Button
        fullWidth
        color="primary"
        type="submit"
        disabled={processing}
        variant="contained"
        aria-label="save"
      >
        Save
      </Button>
    </form>
  )
}
