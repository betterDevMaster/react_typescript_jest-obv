import {TextField, withStyles} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Close from '@material-ui/icons/Close'
import IconButton from 'lib/ui/IconButton'
import {
  CHECKBOX,
  Question,
  RADIO,
  SELECT,
} from 'organization/Event/QuestionsProvider'
import React, {useEffect, useState} from 'react'
import {UseFormMethods} from 'react-hook-form'

export default function OptionsInput(props: {
  questionType: string
  register: UseFormMethods['register']
  question?: Question
}) {
  const {questionType, question} = props
  const [options, setOptions] = useState<string[]>([])

  useEffect(() => {
    setOptions(question?.options || [])
  }, [questionType, question])

  const addOption = () => {
    const added = [...options, '']
    setOptions(added)
  }

  const removeOption = (index: number) => () => {
    const removed = options.filter((_, i) => i !== index)
    setOptions(removed)
  }

  if (!hasOptions(props.questionType)) {
    return null
  }

  return (
    <>
      {options.map((option, index) => (
        <Box mb={2} key={index}>
          <Grid container alignItems="center" key={index}>
            <Grid item xs={11}>
              <OptionTextField
                variant="outlined"
                defaultValue={option}
                name={`options[${index}]`}
                inputProps={{
                  ref: props.register,
                  'aria-label': 'question option',
                }}
                label="Option"
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <IconButton
                  onClick={removeOption(index)}
                  type="button"
                  aria-label="remove option"
                >
                  <Close color="error" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Box mb={2} textAlign="right">
        <Button
          variant="outlined"
          onClick={addOption}
          color="primary"
          type="button"
          aria-label="add option"
        >
          Add Option
        </Button>
      </Box>
    </>
  )
}

const OptionTextField = withStyles({
  root: {
    marginBottom: 0,
  },
})(TextField)

export function hasOptions(type: string) {
  return type === RADIO || type === SELECT || type === CHECKBOX
}
