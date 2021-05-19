import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import {Question, RADIO} from 'organization/Event/QuestionsProvider'
import React from 'react'
import {Controller, UseFormMethods} from 'react-hook-form'

export default function HasOtherOptionSwitch(props: {
  questionType: string
  register: UseFormMethods['register']
  control: UseFormMethods['control']
  question?: Question
}) {
  const {questionType, question, control} = props

  if (!canHaveOtherOption(questionType)) {
    return null
  }

  return (
    <FormControl fullWidth>
      <FormControlLabel
        control={
          <Controller
            name="has_other_option"
            defaultValue={question?.has_other_option || false}
            control={control}
            render={({onChange, value}) => (
              <Switch
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                inputProps={{'aria-label': 'has other option'}}
              />
            )}
          />
        }
        label="Has 'other' option"
      />
    </FormControl>
  )
}

function canHaveOtherOption(type: string) {
  return type === RADIO
}
