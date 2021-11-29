import React, {useCallback} from 'react'
import {v4 as uuid} from 'uuid'
import {Controller, useForm} from 'react-hook-form'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import {useCardsUpdate} from 'Event/template/Cards'
import ComponentConfig, {
  ComponentConfigProps,
  RemoveButton,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {CountDownTimer} from 'Event/Dashboard/components/CountDownTimer'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import {REMOVE, useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'

export default function TimerConfig(
  props: ComponentConfigProps & {
    countDownTimer: CountDownTimer
    id?: string
  },
) {
  const {isVisible, onClose, id, countDownTimer} = props

  const {control, handleSubmit, register} = useForm()

  const updateTemplate = useCardsUpdate()

  const update = (id: string, updated: CountDownTimer) => {
    updateTemplate({
      countDownTimers: {
        [id]: updated,
      },
    })
  }

  const insert = (countDownTimer: CountDownTimer) => {
    const id = uuid()

    updateTemplate({
      countDownTimers: {
        [id]: countDownTimer,
      },
    })
  }

  const removeCountDownTimer = useCallback(() => {
    if (!id) {
      throw new Error('Missing count down timer id')
    }

    updateTemplate({
      countDownTimers: {
        [id]: REMOVE,
      },
    })
  }, [updateTemplate, id])

  useRemoveIfEmpty(removeCountDownTimer, countDownTimer, {shouldSkip: !id})

  const save = (formData: CountDownTimer) => {
    if (id) {
      update(id, formData)
    } else {
      insert(formData)
    }
    onClose()
    return
  }

  useRemoveIfEmpty(removeCountDownTimer, countDownTimer, {
    shouldSkip: !id,
  })

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
                label="Enabled"
              />
            )}
          />
        </FormControl>
        <Controller
          name="end"
          control={control}
          defaultValue={countDownTimer.end}
          render={({onChange, value}) => (
            <LocalizedDateTimePicker
              value={value}
              onChange={(date) => onChange(date?.toISOString())}
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
            defaultValue={countDownTimer.backgroundColor}
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
          name="backgroundOpacity"
          defaultValue={countDownTimer.backgroundOpacity}
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
          defaultValue={countDownTimer.textColor}
          render={({value, onChange}) => (
            <ColorPicker label="Text Color" color={value} onPick={onChange} />
          )}
        />
        <TextField
          label="Description"
          name="description"
          defaultValue={countDownTimer.description}
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
