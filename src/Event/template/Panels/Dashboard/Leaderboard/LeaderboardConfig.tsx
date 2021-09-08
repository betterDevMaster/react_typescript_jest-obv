import React from 'react'
import TextField from '@material-ui/core/TextField'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {Controller, useForm} from 'react-hook-form'
import Button from '@material-ui/core/Button'
import {useUpdate} from 'Event/EventProvider'
import {Panels, usePanels} from 'Event/template/Panels'
import {useToggle} from 'lib/toggle'
import ComponentConfig, {
  ComponentConfigProps,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function LeaderboardConfig(props: ComponentConfigProps) {
  const {template} = usePanels()
  const {leaderboard} = template
  const {register, control, handleSubmit} = useForm()

  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const updateEvent = useUpdate()

  const submit = (data: {
    title: string
    description: string
    points_unit: string
    menuTitle: string
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
        menuTitle: data.menuTitle,
      },
      points_unit: data.points_unit,
    }

    updateEvent({template: updated}).finally(() => {
      toggleProcessing()
      props.onClose()
    })
  }

  return (
    <ComponentConfig
      isVisible={props.isVisible}
      onClose={props.onClose}
      title="Leaderboard"
    >
      <form onSubmit={handleSubmit(submit)}>
        <TextField
          defaultValue={leaderboard.title}
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
          defaultValue={leaderboard.description}
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
          defaultValue={leaderboard.menuTitle}
          name="menuTitle"
          label="Menu Title"
          fullWidth
          inputProps={{
            'aria-label': 'set leaderboard page menu title',
            ref: register({required: 'Title is required'}),
          }}
          disabled={processing}
        />
        <TextField
          defaultValue={template.points_unit}
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
    </ComponentConfig>
  )
}
