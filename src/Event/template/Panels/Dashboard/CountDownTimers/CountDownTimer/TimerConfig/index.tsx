import React, {useCallback} from 'react'
import {v4 as uuid} from 'uuid'
import {Controller, useForm} from 'react-hook-form'
import styled from 'styled-components'
import Slider from '@material-ui/core/Slider'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import ComponentConfig, {
  ComponentConfigProps,
  RemoveButton,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {CountDownTimerSettings} from 'Event/Dashboard/components/CountDownTimer'
import {usePanelsUpdate} from 'Event/template/Panels'
import FormControl from '@material-ui/core/FormControl'
import {REMOVE, useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'

export default function TimerConfig(
  props: ComponentConfigProps & {
    countDownTimer: CountDownTimerSettings
    id?: string
  },
) {
  const {isVisible, onClose, id, countDownTimer} = props
  const updateTemplate = usePanelsUpdate()

  const {control, handleSubmit, register} = useForm()

  const update = (id: string, updated: CountDownTimerSettings) => {
    updateTemplate({
      countDownTimers: {
        [id]: updated,
      },
    })
  }

  const insert = (countDownTimer: CountDownTimerSettings) => {
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

  useRemoveIfEmpty(removeCountDownTimer, countDownTimer, {
    shouldSkip: !id,
  })

  const save = (formData: any) => {
    const data: CountDownTimerSettings = {
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
                label="Timer Background Color"
                color={value}
                onPick={onChange}
              />
            )}
          />
        </FormControl>
        <InputLabel>Timer Background Opacity</InputLabel>
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
        <Row>
          <Column>
            <FormControl fullWidth>
              <Controller
                name="numberColor"
                control={control}
                defaultValue={countDownTimer.numberColor}
                render={({value, onChange}) => (
                  <ColorPicker
                    label="Number Color"
                    color={value}
                    onPick={onChange}
                  />
                )}
              />
            </FormControl>
          </Column>
          <Column>
            <FormControl fullWidth>
              <Controller
                name="numberBackgroundColor"
                control={control}
                defaultValue={countDownTimer.numberBackgroundColor}
                render={({value, onChange}) => (
                  <ColorPicker
                    label="Number Block Background Color"
                    color={value}
                    onPick={onChange}
                  />
                )}
              />
            </FormControl>
          </Column>
        </Row>
        <Row>
          <Column>
            <InputLabel>Number Block Background Opacity</InputLabel>
            <Controller
              name="numberBackgroundOpacity"
              defaultValue={countDownTimer.numberBackgroundOpacity}
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
          </Column>
          <Column>
            <InputLabel>Number Block Background Radius</InputLabel>
            <Controller
              name="numberBackgroundRadius"
              defaultValue={countDownTimer.numberBackgroundRadius}
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
          </Column>
        </Row>
        <Controller
          name="textColor"
          control={control}
          defaultValue={countDownTimer.textColor}
          render={({value, onChange}) => (
            <ColorPicker
              label="Description & Separator Text Color"
              color={value}
              onPick={onChange}
            />
          )}
        />
        <Row>
          <Column>
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
          </Column>
          <Column>
            <TextField
              label="Separator"
              name="separator"
              defaultValue={countDownTimer.separator}
              inputProps={{
                'aria-label': 'separator input',
                maxLength: 1,
                ref: register,
              }}
              fullWidth
            />
          </Column>
        </Row>
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

const Row = styled.div`
  display: flex;
  margin: 0 -${(props) => props.theme.spacing[2]};
`

const Column = styled.div`
  flex: 1;
  padding: 0 ${(props) => props.theme.spacing[2]};
`
