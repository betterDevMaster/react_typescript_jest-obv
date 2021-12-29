import React from 'react'
import TextField from '@material-ui/core/TextField'
import {FormControl} from '@material-ui/core'
import {Controller, useForm} from 'react-hook-form'
import {onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function LeaderboardConfig(props: ComponentConfigProps) {
  const template = useNiftyFiftyTemplate()
  const {leaderboard} = template
  const {register, control, handleSubmit} = useForm()

  const updateTemplate = useNiftyFiftyUpdate()

  const submit = (data: {
    title: string
    description: string
    points_unit: string
    menuTitle: string
    isVisible: boolean
  }) => {
    const {points_unit, ...leaderboardData} = data

    updateTemplate({
      leaderboard: leaderboardData,
      points_unit: points_unit,
    })

    props.onClose()
  }

  return (
    <ComponentConfig
      isVisible={props.isVisible}
      onClose={props.onClose}
      title="Leaderboard"
    >
      <form onSubmit={handleSubmit(submit)}>
        <FormControl>
          <Controller
            name="isVisible"
            control={control}
            defaultValue={leaderboard.isVisible}
            render={({value, onChange}) => (
              <Switch
                checked={value}
                onChange={onChangeCheckedHandler(onChange)}
                arial-label="toggle points"
                labelPlacement="end"
                color="primary"
                label="Enabled"
              />
            )}
          />
        </FormControl>
        <TextField
          defaultValue={leaderboard.title}
          name="title"
          label="Title"
          fullWidth
          inputProps={{
            'aria-label': 'set leaderboard page title',
            ref: register({required: 'Title is required'}),
          }}
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
              <TextEditor data={value} onChange={onChange} />
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
        />
        <SaveButton>Save</SaveButton>
      </form>
    </ComponentConfig>
  )
}
