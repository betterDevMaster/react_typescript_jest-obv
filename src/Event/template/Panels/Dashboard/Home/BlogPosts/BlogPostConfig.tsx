import styled from 'styled-components'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useTemplate} from 'Event/TemplateProvider'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import Switch from 'lib/ui/form/Switch'
import {DateTimePicker} from '@material-ui/pickers'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import FormSelect from 'organization/Event/FormsProvider/FormSelect'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import Box from '@material-ui/core/Box'
import {
  BlogPost,
  useRemovePost,
  useUpdatePost,
} from 'Event/Dashboard/components/BlogPost'
import Dialog from 'lib/ui/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'

export const DEFAULT_MODAL_BUTTON_TEXT = 'Submit'

export function BlogPostConfig(props: {
  targetId: string | null
  onClose: () => void
}) {
  const template = useTemplate()
  const {blogPosts: posts} = template
  const {
    visible: ruleConfigVisible,
    toggle: toggleRuleConfig,
    close: closeRuleConfig,
  } = useRuleConfig()
  const {targetId} = props

  const remove = useRemovePost({list: posts, id: targetId})

  const handleRemove = () => {
    props.onClose()
    remove()
  }

  const update = useUpdatePost({
    list: posts,
    id: targetId,
  })

  if (!targetId) {
    return null
  }

  const handleClose = () => {
    closeRuleConfig()
    props.onClose()
  }

  const post = posts.entities[targetId]
  if (!post) {
    return null
  }

  const updatePublishAt = (date: MaterialUiPickersDate) => {
    const value = date ? date.toISOString() : null
    update('publishAt')(value)
  }

  return (
    <Dialog open onClose={handleClose} fullWidth>
      <DialogTitle>Blog Post</DialogTitle>
      <DialogContent>
        <RuleConfig
          visible={ruleConfigVisible}
          close={toggleRuleConfig}
          rules={post.rules}
          onChange={update('rules')}
        >
          <>
            <TextEditorContainer>
              <ConfigureRulesButton onClick={toggleRuleConfig} />
              <Switch
                checked={post.isVisible}
                onChange={onChangeCheckedHandler(update('isVisible'))}
                arial-label="config visible switch"
                labelPlacement="end"
                color="primary"
                label={post.isVisible ? 'Enable' : 'Disable'}
              />
              <TextField
                value={post.title}
                inputProps={{
                  'aria-label': 'blog post title',
                }}
                label="Title"
                fullWidth
                onChange={onChangeStringHandler(update('title'))}
              />
              <DateTimePicker
                clearable
                value={post.publishAt}
                onChange={updatePublishAt}
                fullWidth
                label="Publish Date"
                inputProps={{
                  'aria-label': 'post publish at',
                }}
              />
              <Box mb={2}>
                <Switch
                  checked={Boolean(post.hideDate)}
                  onChange={onChangeCheckedHandler(update('hideDate'))}
                  arial-label="toggle hide date"
                  labelPlacement="end"
                  color="primary"
                  label="Hide Date"
                />
              </Box>
              <StyledTextEditor
                data={post.content}
                onChange={update('content')}
              />
              <FormControl fullWidth>
                <InputLabel>Form</InputLabel>
                <FormSelect value={post.formId} onChange={update('formId')} />
              </FormControl>
              <FormFields post={post}>
                <FormControl>
                  <FormControlLabel
                    label="Open in modal?"
                    control={
                      <Checkbox
                        disableRipple
                        checked={post.isModalForm || false}
                        onChange={onChangeCheckedHandler(update('isModalForm'))}
                      />
                    }
                  />
                </FormControl>
                <IfModalForm post={post}>
                  <TextField
                    label="Modal Button Text"
                    value={post.modalButtonText || DEFAULT_MODAL_BUTTON_TEXT}
                    inputProps={{
                      'aria-label': 'open form modal text',
                    }}
                    fullWidth
                    onChange={onChangeStringHandler(update('modalButtonText'))}
                  />
                </IfModalForm>
              </FormFields>
              <RemoveButton
                fullWidth
                variant="outlined"
                aria-label="remove blog post"
                onClick={handleRemove}
              >
                DELETE POST
              </RemoveButton>
            </TextEditorContainer>
          </>
        </RuleConfig>
      </DialogContent>
    </Dialog>
  )
}

function FormFields(props: {
  post: BlogPost
  children: React.ReactElement | React.ReactElement[]
}) {
  if (!props.post.formId) {
    return null
  }

  return <>{props.children}</>
}

function IfModalForm(props: {post: BlogPost; children: React.ReactElement}) {
  if (!props.post.isModalForm) {
    return null
  }

  return props.children
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[5]}!important;
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const StyledTextEditor = styled(TextEditor)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
