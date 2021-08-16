import TextField from '@material-ui/core/TextField'
import {PRICE, Question} from 'organization/Event/QuestionsProvider'
import React from 'react'
import {UseFormMethods} from 'react-hook-form'

export default function CharacterLimitInputs(props: {
  questionType: string
  register: UseFormMethods['register']
  question?: Question
}) {
  const {questionType, question, register} = props

  if (!canSpecifyCurrency(questionType)) {
    return null
  }

  return (
    <TextField
      label="Currency Symbol"
      fullWidth
      variant="outlined"
      name="start_adornment"
      defaultValue={question?.start_adornment || ''}
      inputProps={{
        ref: register,
        'aria-label': 'currency symbol',
      }}
    />
  )
}

function canSpecifyCurrency(type: string) {
  return type === PRICE
}
