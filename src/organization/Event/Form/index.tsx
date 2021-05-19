import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import Page from 'organization/Event/Page'
import CreateQuestionDialog from 'organization/Event/Form/dialog/CreateQuestionDialog'
import FormActions from 'organization/Event/Form/FormActions'
import QuestionsProvider, {
  Question,
  useQuestions,
} from 'organization/Event/QuestionsProvider'
import Layout from 'organization/user/Layout'
import React, {useEffect, useRef, useState} from 'react'
import QuestionEditDialog from 'organization/Event/Form/dialog/EditQuestionDialog'
import QuestionsList from 'organization/Event/Form/QuestionsList'
import {useForm as useEventForm} from 'organization/Event/Form/FormProvider'
import {Form as FormData} from 'organization/Event/FormsProvider'
import {Controller, useForm as useHookForm} from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import {onChangeCheckedHandler} from 'lib/dom'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import {OrganizationActionsProvider} from 'Event/ActionsProvider'
import Typography from '@material-ui/core/Typography'
import {InfusionsoftTag} from 'Event/infusionsoft'
import InfusionsoftTagInput from 'organization/Event/DashboardConfig/InfusionsoftTagInput'
import {fieldError} from 'lib/form'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'

export default function Form() {
  const {form, processing, responseError} = useEventForm()
  const [editing, setEditing] = useState<Question | null>(null)
  const [addQuestionDialogVisible, setAddQuestionDialogVisible] =
    useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const toggleAddQuestionDialog = () =>
    setAddQuestionDialogVisible(!addQuestionDialogVisible)

  const stopEditing = () => setEditing(null)

  /**
   * Save the form config. We want the question list OUTSIDE of the
   * html form to avoid triggering validation, so this is the
   * workaround to allow that.
   */
  const save = () => {
    if (!formRef.current) {
      return
    }

    formRef.current.dispatchEvent(new Event('submit'))
  }

  return (
    <OrganizationActionsProvider
      loader={
        <Layout>
          <Page>
            <div>loading...</div>
          </Page>
        </Layout>
      }
    >
      <QuestionsProvider form={form}>
        <Layout>
          <Page>
            <CreateQuestionDialog
              isVisible={addQuestionDialogVisible}
              onClose={toggleAddQuestionDialog}
            />
            <QuestionEditDialog question={editing} onClose={stopEditing} />
            <StyledFormActions />
            <StyledErrorAlert>{responseError?.message}</StyledErrorAlert>

            <Typography variant="h6">Questions</Typography>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="primary"
                aria-label="add question"
                onClick={toggleAddQuestionDialog}
                disabled={processing}
              >
                Add Question
              </Button>
            </Box>
            <QuestionsList onSelect={setEditing} />
            <Box mb={2}>
              <FormConfig ref={formRef} setEditing={setEditing} />
            </Box>
            <Button
              onClick={save}
              fullWidth
              color="primary"
              variant="contained"
              disabled={processing}
              aria-label="save form"
            >
              Save
            </Button>
          </Page>
        </Layout>
      </QuestionsProvider>
    </OrganizationActionsProvider>
  )
}

const FormConfig = React.forwardRef<
  HTMLFormElement,
  {
    setEditing: (question: Question | null) => void
  }
>((props, ref) => {
  const {handleSubmit, register, control, errors: formErrors} = useHookForm()
  const {form, update, processing, responseError} = useEventForm()
  const {questions} = useQuestions()
  const [infusionsoftTag, setInfusionsoftTag] =
    useState<InfusionsoftTag | null>(null)

  useEffect(() => {
    if (form.infusionsoft_tag_id && form.infusionsoft_tag_name) {
      setInfusionsoftTag({
        name: form.infusionsoft_tag_name,
        id: form.infusionsoft_tag_id,
      })
    }
  }, [form])

  const submit = (data: Partial<FormData>) => {
    const withAttributes: Partial<FormData> = {
      ...data,
      questions: [...questions],
      infusionsoft_tag_name: infusionsoftTag?.name || null,
      infusionsoft_tag_id: infusionsoftTag?.id || null,
    }

    update(withAttributes)
  }

  const error = (key: keyof FormData) =>
    fieldError(key, {
      response: responseError,
      form: formErrors,
    })

  const nameError = error('name')
  const onSubmitRedirectUrlError = error('on_submit_redirect_url')
  const submissionWebhookUrlError = error('submission_webhook_url')
  const submitLabelError = error('submit_label')

  return (
    <>
      <form onSubmit={handleSubmit(submit)} ref={ref}>
        <TextField
          defaultValue={form.name}
          variant="outlined"
          fullWidth
          required
          name="name"
          inputProps={{'aria-label': 'form name', ref: register}}
          disabled={processing}
          error={!!nameError}
          helperText={nameError}
        />
        <Controller
          control={control}
          name="can_resubmit"
          defaultValue={form.can_resubmit || false}
          render={({onChange, value}) => (
            <FormControl>
              <FormControlLabel
                label="Can Edit Answer?"
                control={
                  <Checkbox
                    checked={!!value}
                    disabled={processing}
                    onChange={onChangeCheckedHandler(onChange)}
                    color="primary"
                    inputProps={{
                      'aria-label': 'toggle can re-submit',
                    }}
                    disableRipple
                  />
                }
              />
            </FormControl>
          )}
        />
        <TextField
          label="Submit Label"
          name="submit_label"
          defaultValue={form.submit_label}
          inputProps={{
            'aria-label': 'form submit label',
            ref: register,
          }}
          disabled={processing}
          fullWidth
          helperText={submitLabelError}
          error={!!submitLabelError}
        />
        <TextField
          label="Redirect URL (optional)"
          name="on_submit_redirect_url"
          defaultValue={form.on_submit_redirect_url}
          inputProps={{
            'aria-label': 'redirect url after submit',
            ref: register,
          }}
          fullWidth
          disabled={processing}
          error={!!onSubmitRedirectUrlError}
          helperText={
            onSubmitRedirectUrlError ||
            'URL to redirect to after completing form. Starting with https:// or http://.'
          }
        />
        <TextField
          label="Submission Webhook URL (optional)"
          name="submission_webhook_url"
          defaultValue={form.submission_webhook_url}
          inputProps={{
            'aria-label': 'submission webhook url',
            ref: register,
          }}
          disabled={processing}
          fullWidth
          helperText={
            submissionWebhookUrlError ||
            'Webhook URL to send submissions. Starting with https:// or http://.'
          }
          error={!!submissionWebhookUrlError}
        />

        <Controller
          control={control}
          name="action_id"
          defaultValue={form.action?.id || ''}
          render={({onChange, value}) => (
            <ActionSelect
              value={value}
              onChange={onChange}
              useId
              disabled={processing}
            />
          )}
        />
      </form>
      <InfusionsoftTagInput
        value={infusionsoftTag}
        onChange={setInfusionsoftTag}
        disabled={processing}
      />
    </>
  )
})

const StyledFormActions = styled(FormActions)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`

const StyledErrorAlert = styled(ErrorAlert)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
