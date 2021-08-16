import TextField from '@material-ui/core/TextField'
import {
  LONG_ANSWER_TEXT,
  Question,
  SHORT_ANSWER_TEXT,
} from 'organization/Event/QuestionsProvider'
import React from 'react'
import {UseFormMethods} from 'react-hook-form'

export default function CharacterLimitInputs(props: {
  questionType: string
  register: UseFormMethods['register']
  question?: Question
}) {
  const {questionType, question, register} = props

  if (!isTextQuestion(questionType)) {
    return null
  }

  return (
    <>
      <TextField
        label="Character Limit"
        fullWidth
        variant="outlined"
        name="character_limit"
        type="number"
        defaultValue={question?.character_limit || ''}
        inputProps={{
          ref: register,
          'aria-label': 'character limit',
        }}
      />
      <TextField
        label="Limit Error Message"
        fullWidth
        variant="outlined"
        name="character_limit_error_message"
        defaultValue={question?.character_limit_error_message || ''}
        inputProps={{
          ref: register,
          'aria-label': 'limit error message',
        }}
      />
    </>
  )
}

function isTextQuestion(type: string) {
  return type === SHORT_ANSWER_TEXT || type === LONG_ANSWER_TEXT
}
