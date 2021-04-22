import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import {Question, SELECT} from 'organization/Event/QuestionsProvider'
import React from 'react'
import {Controller, UseFormMethods} from 'react-hook-form'

export default function AllowsMultipleSwitch(props: {
  questionType: string
  register: UseFormMethods['register']
  control: UseFormMethods['control']
  question?: Question
}) {
  const {questionType, question, control} = props

  if (!canSelectMultiple(questionType)) {
    return null
  }

  return (
    <FormControl fullWidth>
      <FormControlLabel
        control={
          <Controller
            name="allows_multiple_options"
            defaultValue={question?.allows_multiple_options || false}
            control={control}
            render={({onChange, value}) => (
              <Switch
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                inputProps={{'aria-label': 'allows multiple options'}}
              />
            )}
          />
        }
        label="Allow multiple"
      />
    </FormControl>
  )
}

function canSelectMultiple(type: string) {
  return type === SELECT
}
