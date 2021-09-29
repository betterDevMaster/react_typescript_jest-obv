import React from 'react'
import {v4 as uuid} from 'uuid'
import {Controller, useForm} from 'react-hook-form'
import Slider from '@material-ui/core/Slider'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import ComponentConfig, {
  ComponentConfigProps,
  RemoveButton,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {CountDownTimer} from 'Event/Dashboard/components/CountDownTimer'
import {usePanels} from 'Event/template/Panels'
import FormControl from '@material-ui/core/FormControl'

export default function TimerConfig(
  props: ComponentConfigProps & {
    countDownTimer: CountDownTimer
    id?: string
  },
) {
  const {isVisible, onClose, id, countDownTimer} = props
  const {template} = usePanels()
  const {countDownTimers} = template

  const {control, handleSubmit, register} = useForm()

  const updateTemplate = useDispatchUpdate()

  const update = (id: string, updated: CountDownTimer) => {
    updateTemplate({
      countDownTimers: {
        ...countDownTimers,
        entities: {
          ...countDownTimers.entities,
          [id]: updated,
        },
      },
    })
  }

  const insert = (countDownTimer: CountDownTimer) => {
    const id = uuid()

    updateTemplate({
      countDownTimers: {
        ids: [...countDownTimers.ids, id],
        entities: {
          ...countDownTimers.entities,
          [id]: countDownTimer,
        },
      },
    })
  }

  const removeCountDownTimer = () => {
    if (!id) {
      throw new Error('Missing count down timer id')
    }

    const {[id]: target, ...otherTimers} = countDownTimers.entities
    const updatedIds = countDownTimers.ids.filter((i) => i !== id)

    updateTemplate({
      countDownTimers: {
        entities: otherTimers,
        ids: updatedIds,
      },
    })
  }

  const save = (formData: any) => {
    const data: CountDownTimer = {
      ...formData,
    }

    if (id) {
      update(id, data)
      onClose()
      return
    }

    insert(data)
    onClose()
  }

  const showingRemove = Boolean(id)

  return (
    <ComponentConfig
      isVisible={isVisible}
      onClose={onClose}
      title="Count Down Timer Config"
    >
      <form onSubmit={handleSubmit(save)}>
        <FormControl>
          <Controller
            name="enabled"
            control={control}
            defaultValue={countDownTimer.enabled}
            render={({value, onChange}) => (
              <Switch
                checked={value}
                onChange={onChangeCheckedHandler(onChange)}
                arial-label="toggle countdown timer"
                labelPlacement="end"
                color="primary"
                label={countDownTimer.enabled ? 'Enable' : 'Disable'}
              />
            )}
          />
        </FormControl>
        <Controller
          name="end"
          control={control}
          defaultValue={countDownTimer.end || null}
          render={({onChange, value}) => (
            <LocalizedDateTimePicker
              value={value}
              onChange={(date) => onChange(date?.toISOString() || '')}
              fullWidth
              label="End"
              inputProps={{
                'aria-label': 'start time',
                onChange,
              }}
            />
          )}
        />
        <FormControl fullWidth>
          <Controller
            name="backgroundColor"
            control={control}
            defaultValue={countDownTimer.backgroundColor || ''}
            render={({value, onChange}) => (
              <ColorPicker
                label="Background Color"
                color={value}
                onPick={onChange}
              />
            )}
          />
        </FormControl>
        <InputLabel>Background Opacity</InputLabel>
        <Controller
          name="opacity"
          defaultValue={countDownTimer.opacity || 1}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={0}
              max={1}
              step={0.1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
            />
          )}
        />
        <Controller
          name="textColor"
          control={control}
          defaultValue={countDownTimer.textColor || ''}
          render={({value, onChange}) => (
            <ColorPicker label="Text Color" color={value} onPick={onChange} />
          )}
        />
        <TextField
          label="Description"
          name="description"
          defaultValue={countDownTimer.description || ''}
          inputProps={{
            'aria-label': 'description input',
            ref: register,
          }}
          fullWidth
        />
        <SaveButton type="submit" />
        <RemoveButton
          aria-label="remove countdown"
          onClick={removeCountDownTimer}
          showing={showingRemove}
        />
      </form>
    </ComponentConfig>
  )
}
