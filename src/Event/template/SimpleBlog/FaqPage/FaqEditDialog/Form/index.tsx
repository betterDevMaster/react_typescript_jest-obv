import styled from 'styled-components'
import React from 'react'
import {FAQ} from 'Event/FaqPage'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import TextEditor from 'lib/ui/form/TextEditor'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DangerButton from 'lib/ui/Button/DangerButton'
import {ValidationError} from 'lib/api-client'
import {fieldError} from 'lib/form'
import Box from '@material-ui/core/Box'
import {useFaqs} from 'organization/Event/FaqsProvider'
import {Rule} from 'Event/attendee-rules'
import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'
import Switch from 'lib/ui/form/Switch'
import {onChangeCheckedHandler} from 'lib/dom'

export default function EditFaqForm(props: {faq: FAQ; onDone: () => void}) {
  const {register, handleSubmit, control, errors} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const {faq} = props
  const {client} = useOrganization()
  const [serverError, setServerError] = useState<ValidationError<any>>(null)
  const {update, remove} = useFaqs()
  const [rules, setRules] = useState<Rule[]>(faq.settings?.rules || [])
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const [showAnswerOnLoad, setShowAnswerOnLoad] = useState(
    faq.settings?.showAnswerOnLoad || false,
  )

  const submit = (data: FAQ) => {
    setSubmitting(true)

    const withSettings: FAQ = {
      ...data,
      settings: {
        ...(faq.settings || {}),
        rules,
        showAnswerOnLoad,
      },
    }

    const url = api(`/faqs/${faq.id}`)

    client
      .put<FAQ>(url, withSettings)
      .then((faq) => {
        update(faq)
        props.onDone()
      })
      .catch((e) => {
        setServerError(e)
        setSubmitting(false)
      })
  }

  const handleRemove = () => {
    setSubmitting(true)
    const url = api(`/faqs/${faq.id}`)

    client
      .delete<FAQ>(url)
      .then(() => remove(faq))
      .catch(() => {
        setSubmitting(false)
      })
  }

  const nameError = fieldError('name', {form: errors, response: serverError})

  return (
    <RuleConfig
      visible={ruleConfigVisible}
      close={toggleRuleConfig}
      rules={rules}
      onChange={setRules}
    >
      <>
        <ConfigureRulesButton onClick={toggleRuleConfig} />
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            name="question"
            label="Question"
            required
            fullWidth
            inputProps={{
              ref: register({required: 'Faq question is required.'}),
              'aria-label': 'faq question',
            }}
            error={Boolean(nameError)}
            helperText={nameError}
            defaultValue={faq.question}
          />
          <Box mb={1}>
            <Controller
              name="answer"
              control={control}
              defaultValue={faq.answer || ''}
              render={({onChange, value}) => (
                <TextEditor data={value} onChange={onChange} />
              )}
            />
          </Box>
          <Box mb={2}>
            <Switch
              color="primary"
              label="Show answer on load"
              labelPlacement="end"
              checked={showAnswerOnLoad}
              onChange={onChangeCheckedHandler(setShowAnswerOnLoad)}
            />
          </Box>
          <SaveButton
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            aria-label="save faq"
            disabled={submitting}
          >
            SAVE
          </SaveButton>
          <RemoveButton
            fullWidth
            variant="outlined"
            aria-label="remove faq"
            onClick={handleRemove}
            disabled={submitting}
          >
            REMOVE
          </RemoveButton>
        </form>
      </>
    </RuleConfig>
  )
}

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const RemoveButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
