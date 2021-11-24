import styled from 'styled-components'
import React, {useEffect, useState} from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import Switch from 'lib/ui/form/Switch'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import FormSelect from 'organization/Event/FormsProvider/FormSelect'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'
import Box from '@material-ui/core/Box'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useTemplate} from 'Event/TemplateProvider'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import {usePanelsTemplate, usePanelsUpdate} from 'Event/template/Panels'
import {v4 as uid} from 'uuid'
import {REMOVE} from 'Event/TemplateUpdateProvider'

export const DEFAULT_MODAL_BUTTON_TEXT = 'Submit'

export function EditPost(props: {id: string | null; onClose: () => void}) {
  const {id, onClose} = props
  const {blogPosts} = useTemplate()

  if (!id) {
    return null
  }

  const post = blogPosts.entities[id]

  return <BlogPostConfig id={id} isVisible post={post} onClose={onClose} />
}

export default function BlogPostConfig(
  props: ComponentConfigProps & {
    post: BlogPost
    id?: string
  },
) {
  const {isVisible: visible, onClose, id, post} = props
  const {
    visible: ruleConfigVisible,
    toggle: toggleRuleConfig,
    close: closeRuleConfig,
  } = useRuleConfig()

  const [rules, setRules] = useState(post.rules)
  const [isVisible, setIsVisible] = useState(post.isVisible)
  const [title, setTitle] = useState(post.title)
  const [publishAt, setPublishAt] = useState(post.publishAt)
  const [hideDate, setHideDate] = useState(post.hideDate)
  const [content, setContent] = useState(post.content)
  const [formId, setFormId] = useState(post.formId)
  const [isModalForm, setIsModalForm] = useState(post.isModalForm)
  const [modalButtonText, setModalButtonText] = useState(post.modalButtonText)

  useEffect(() => {
    if (visible) {
      return
    }

    setRules(post.rules)
    setIsVisible(post.isVisible)
    setTitle(post.title)
    setPublishAt(post.publishAt)
    setHideDate(post.hideDate)
    setContent(post.content)
    setFormId(post.formId)
    setIsModalForm(post.isModalForm)
    setModalButtonText(post.modalButtonText)
  }, [visible, post])

  const update = useUpdatePost()
  const insert = useInsertPost()
  const remove = useRemovePost()

  const handleClose = () => {
    closeRuleConfig()
    props.onClose()
  }

  const save = () => {
    const data: BlogPost = {
      ...post,
      rules,
      isVisible,
      title,
      publishAt,
      hideDate,
      content,
      formId,
      isModalForm,
      modalButtonText,
    }

    if (id) {
      update(id, data)
      onClose()
      return
    }

    insert(data)
    onClose()
  }

  const handleRemove = () => {
    if (!id) {
      throw new Error(`Could not remove post; missing id.`)
    }

    onClose()
    remove(id)
  }

  const handleDate = (set: (date: string | null) => void) => (
    date: MaterialUiPickersDate,
  ) => {
    const value = date ? date.toISOString() : null
    set(value)
  }

  return (
    <ComponentConfig
      isVisible={visible}
      onClose={handleClose}
      title="Blog Post"
    >
      <RuleConfig
        visible={ruleConfigVisible}
        close={toggleRuleConfig}
        rules={rules}
        onChange={setRules}
      >
        <>
          <TextEditorContainer>
            <ConfigureRulesButton onClick={toggleRuleConfig} />
            <Switch
              checked={isVisible}
              onChange={onChangeCheckedHandler(setIsVisible)}
              arial-label="config visible switch"
              labelPlacement="end"
              color="primary"
              label={isVisible ? 'Enable' : 'Disable'}
            />
            <TextField
              value={title}
              inputProps={{
                'aria-label': 'blog post title',
              }}
              label="Title"
              fullWidth
              onChange={onChangeStringHandler(setTitle)}
            />
            <LocalizedDateTimePicker
              clearable
              value={publishAt}
              onChange={handleDate(setPublishAt)}
              fullWidth
              label="Publish Date"
              inputProps={{
                'aria-label': 'post publish at',
              }}
            />
            <Box mb={2}>
              <Switch
                checked={Boolean(hideDate)}
                onChange={onChangeCheckedHandler(setHideDate)}
                arial-label="toggle hide date"
                labelPlacement="end"
                color="primary"
                label="Hide Date"
              />
            </Box>
            <StyledTextEditor data={content} onChange={setContent} />
            <FormControl fullWidth>
              <InputLabel>Form</InputLabel>
              <FormSelect value={formId} onChange={setFormId} />
            </FormControl>
            <FormFields post={post}>
              <FormControl>
                <FormControlLabel
                  label="Open in modal?"
                  control={
                    <Checkbox
                      disableRipple
                      checked={isModalForm || false}
                      onChange={onChangeCheckedHandler(setIsModalForm)}
                    />
                  }
                />
              </FormControl>
              <IfModalForm post={post}>
                <TextField
                  label="Modal Button Text"
                  value={modalButtonText || DEFAULT_MODAL_BUTTON_TEXT}
                  inputProps={{
                    'aria-label': 'open form modal text',
                  }}
                  fullWidth
                  onChange={onChangeStringHandler(setModalButtonText)}
                />
              </IfModalForm>
            </FormFields>
            <SaveButton onClick={save} />
            <RemoveButton
              fullWidth
              variant="outlined"
              aria-label="remove blog post"
              onClick={handleRemove}
              disabled={!id}
            >
              DELETE POST
            </RemoveButton>
          </TextEditorContainer>
        </>
      </RuleConfig>
    </ComponentConfig>
  )
}

function useUpdatePost() {
  const update = usePanelsUpdate()

  return (id: string, updated: BlogPost) => {
    update({
      blogPosts: {
        entities: {
          [id]: updated,
        },
      },
    })
  }
}

function useInsertPost() {
  const update = usePanelsUpdate()
  const {blogPosts} = useTemplate()

  return (post: BlogPost) => {
    const id = uid()

    const ids = [id, ...blogPosts.ids]

    update({
      blogPosts: {
        entities: {
          [id]: post,
        },
        ids: ids,
      },
    })
  }
}

function useRemovePost() {
  const update = usePanelsUpdate()
  const {blogPosts} = useTemplate()

  return (id: string) => {
    const {[id]: target, ...otherPosts} = blogPosts.entities
    const updatedIds = blogPosts.ids.filter((i) => i !== id)

    update({
      blogPosts: {
        entities: {
          [id]: REMOVE,
        },
        ids: updatedIds,
      },
    })
  }
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
