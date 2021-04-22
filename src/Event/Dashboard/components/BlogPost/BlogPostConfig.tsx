import {BlogPost, BLOG_POST} from 'Event/Dashboard/components/BlogPost'
import styled from 'styled-components'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
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
import RuleConfig, {
  useRuleConfig,
} from 'Event/Dashboard/component-rules/RuleConfig'
import ConfigureRulesButton from 'Event/Dashboard/component-rules/ConfigureRulesButton'

export const DEFAULT_MODAL_BUTTON_TEXT = 'Submit'

export type BlogPostConfig = {
  type: typeof BLOG_POST
  id: string
}

export function BlogPostConfig(props: {id: BlogPostConfig['id']}) {
  const {blogPosts: posts} = useTemplate()
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const {id} = props
  const updateTemplate = useUpdateTemplate()
  const closeConfig = useCloseConfig()

  if (!id) {
    throw new Error('Missing post id; was it passed through when calling edit?')
  }

  const post = posts.entities[id]

  const update = <T extends keyof BlogPost>(key: T) => (value: BlogPost[T]) => {
    const updated: BlogPost = {
      ...post,
      [key]: value,
    }

    updateTemplate({
      blogPosts: {
        ...posts,
        entities: {
          ...posts.entities,
          [id]: updated,
        },
      },
    })
  }

  const remove = () => {
    const {[id]: target, ...otherPosts} = posts.entities
    const updatedIds = posts.ids.filter((i) => i !== id)

    closeConfig()
    updateTemplate({
      blogPosts: {
        entities: otherPosts,
        ids: updatedIds,
      },
    })
  }

  const updatePublishAt = (date: MaterialUiPickersDate) => {
    const value = date ? date.toISOString() : null
    update('publishAt')(value)
  }

  return (
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
          <StyledTextEditor data={post.content} onChange={update('content')} />
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
            <TextField
              value={post.formSubmittedText || ''}
              label="Submitted Message"
              fullWidth
              inputProps={{
                'aria-label': 'submitted message',
              }}
              multiline
              rows="2"
              onChange={onChangeStringHandler(update('formSubmittedText'))}
            />
          </FormFields>
          <RemoveButton
            fullWidth
            variant="outlined"
            aria-label="remove blog post"
            onClick={remove}
          >
            DELETE POST
          </RemoveButton>
        </TextEditorContainer>
      </>
    </RuleConfig>
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
