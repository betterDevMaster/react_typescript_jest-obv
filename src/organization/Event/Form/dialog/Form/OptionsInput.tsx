import {TextField, withStyles} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Close from '@material-ui/icons/Close'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import IconButton from 'lib/ui/IconButton'
import {
  CHECKBOX,
  Question,
  Option,
  RADIO,
  SELECT,
} from 'organization/Event/QuestionsProvider'
import React from 'react'
import {Controller, useFieldArray, UseFormMethods} from 'react-hook-form'

export default function OptionsInput(props: {
  questionType: string
  question?: Question
  control: UseFormMethods['control']
  register: UseFormMethods['register']
}) {
  const {questionType, control, register} = props

  const {fields, append, remove} = useFieldArray<Option>({
    control,
    name: 'options',
  })

  const addOption = () => {
    append({
      value: '',
      action_id: null,
    })
  }

  const removeOption = (index: number) => () => {
    remove(index)
  }

  if (!hasOptions(questionType)) {
    return null
  }

  return (
    <>
      {fields.map((option, index) => {
        return (
          <Box mb={2} key={option.id}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <OptionTextField
                  variant="outlined"
                  name={`options[${index}].value`}
                  inputRef={register()}
                  inputProps={{
                    'aria-label': 'question option',
                  }}
                  label="Option"
                  defaultValue={option.value}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <Controller
                  control={control}
                  name={`options[${index}].action_id`}
                  defaultValue={option.action_id}
                  render={({value, onChange}) => (
                    <ActionSelect
                      useId
                      variant="outlined"
                      label="Action"
                      disableMargin
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={1}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
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
        )
      })}
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
