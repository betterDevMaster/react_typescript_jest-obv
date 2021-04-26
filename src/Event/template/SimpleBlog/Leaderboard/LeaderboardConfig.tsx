import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import ColorPicker from 'lib/ui/ColorPicker'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {useTemplate} from 'Event/TemplateProvider'
import {Controller, useForm} from 'react-hook-form'
import {SimpleBlog} from 'Event/template/SimpleBlog'
import Button from '@material-ui/core/Button'
import {useUpdate} from 'Event/EventProvider'

export const DEFAULT_TITLE = 'Leaderboard'
export const DEFAULT_DESCRIPTION =
  '<p>{{first name}}, you have earned {{points}} {{unit}}, and you are currently {{position}}. Great Job!</p><p><i>The list below is the top 200 point earners! If you don’t see your name listed, there’s still time!</i></p><p><br>&nbsp;</p>'
export const DEFAULT_BACK_TO_DASHBOARD_TEXT = 'Back to Dashboard'
export const DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR = '#000000'

export type LeaderboardConfigData = NonNullable<SimpleBlog['leaderboard']>

export default function LeaderboardConfig(props: {onComplete?: () => void}) {
  const template = useTemplate()
  const {leaderboard} = template
  const {register, control, handleSubmit} = useForm()
  const [processing, setProcessing] = useState(false)
  const updateEvent = useUpdate()

  const submit = (data: LeaderboardConfigData) => {
    if (processing) {
      return
    }

    setProcessing(true)

    const existing = template.leaderboard || {}

    const updated = {
      ...template,
      leaderboard: {
        ...existing,
        ...data,
      },
    }

    updateEvent({template: updated}).finally(() => {
      setProcessing(false)
      props.onComplete && props.onComplete()
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="backToDashboardText"
            defaultValue={
              leaderboard?.backToDashboardText || DEFAULT_BACK_TO_DASHBOARD_TEXT
            }
            label="Back to Dashboard Text"
            fullWidth
            inputProps={{
              'aria-label': 'set leaderboard page back to dashboard text',
              ref: register({required: 'Back to dashboard text is required'}),
            }}
            required
            disabled={processing}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="backToDashboardTextColor"
            control={control}
            defaultValue={
              leaderboard?.backToDashboardTextColor ||
              DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR
            }
            render={({value, onChange}) => (
              <ColorPicker
                label="Back to Dashboard Text Color"
                color={value}
                onPick={onChange}
                aria-label="set back to dashboard text color"
                disabled={processing}
              />
            )}
          />
        </Grid>
      </Grid>

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
