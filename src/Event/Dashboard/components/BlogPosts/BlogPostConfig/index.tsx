import React, {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import styled from 'styled-components'

import {Box, InputLabel, Slider, TextField} from '@material-ui/core'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'

import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'
import {
  BlogPost,
  useInsertPost,
  useRemovePost,
  useUpdatePost,
} from 'Event/Dashboard/components/BlogPosts'
import {useTemplate} from 'Event/TemplateProvider'
import AttachmentConfig from 'Event/Dashboard/components/BlogPosts/BlogPostConfig/AttachmentConfig'

import Switch from 'lib/ui/form/Switch'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {DeepRequired} from 'lib/type-utils'
import LocalizedDateTimePicker from 'lib/LocalizedDateTimePicker'
import ColorPicker from 'lib/ui/ColorPicker'
import {numberFormat} from 'lib/numberFormat'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'

import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export const DEFAULT_MODAL_BUTTON_TEXT = 'Submit'

export function EditPost(props: {id: string | null; onClose: () => void}) {
  const {id, onClose} = props
  const {blogPosts} = useTemplate()

  if (!id) {
    return null
  }

  const post = blogPosts[id]
  if (!post) {
    return null
  }

  return <BlogPostConfig id={id} isVisible post={post} onClose={onClose} />
}

export default function BlogPostConfig(
  props: ComponentConfigProps & {
    post: DeepRequired<BlogPost>
    id?: string
  },
) {
  const {isVisible: visible, onClose, id, post} = props
  const {
    visible: ruleConfigVisible,
    toggle: toggleRuleConfig,
    close: closeRuleConfig,
  } = useRuleConfig()

  const {register, control, handleSubmit, watch} = useForm()

  const [rules, setRules] = useState(post.rules)

  const update = useUpdatePost()
  const insert = useInsertPost()
  const remove = useRemovePost()

  const handleClose = () => {
    closeRuleConfig()
    props.onClose()
  }

  const attachment: NonNullable<BlogPost['attachment']> =
    watch('attachment') || post.attachment

  const save = (form: BlogPost) => {
    const data: BlogPost = {
      ...post,
      rules,
      ...form,
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
      <form onSubmit={handleSubmit(save)}>
        <RuleConfig
          visible={ruleConfigVisible}
          close={toggleRuleConfig}
          rules={rules}
          onChange={setRules}
        >
          <>
            <TextEditorContainer>
              <ConfigureRulesButton onClick={toggleRuleConfig} />
              <Controller
                name="isVisible"
                defaultValue={post.isVisible}
                control={control}
                render={({value, onChange}) => (
                  <Switch
                    checked={value}
                    onChange={onChangeCheckedHandler(onChange)}
                    arial-label="config visible switch"
                    labelPlacement="end"
                    color="primary"
                    label="Enabled"
                  />
                )}
              />
              <Box display="flex" flexDirection="row" flex="2">
                <Box flex="1" mr={2}>
                  <Controller
                    name="backgroundColor"
                    defaultValue={post.backgroundColor}
                    control={control}
                    render={({value, onChange}) => (
                      <ColorPicker
                        label="Background Color"
                        color={value || '#FFFFFF'}
                        onPick={onChange}
                        aria-label="blog post background color"
                      />
                    )}
                  />
                </Box>
                <Box flex="1">
                  <InputLabel>Background Opacity</InputLabel>
                  <Controller
                    name="backgroundOpacity"
                    defaultValue={post.backgroundOpacity}
                    control={control}
                    render={({value, onChange}) => (
                      <Slider
                        valueLabelDisplay="auto"
                        aria-label="blog post background opacity"
                        value={value}
                        valueLabelFormat={(num) => numberFormat(num, 100)}
                        onChange={handleChangeSlider(onChange)}
                        step={0.01}
                        min={0}
                        max={1}
                      />
                    )}
                  />
                </Box>
              </Box>
              <TextField
                name="title"
                defaultValue={post.title}
                inputProps={{
                  'aria-label': 'blog post title',
                  ref: register,
                }}
                label="Title"
                fullWidth
              />

              <Controller
                name="publishAt"
                defaultValue={post.publishAt}
                control={control}
                render={({value, onChange}) => (
                  <LocalizedDateTimePicker
                    clearable
                    value={value}
                    onChange={handleDate(onChange)}
                    fullWidth
                    label="Publish Date"
                    inputProps={{
                      'aria-label': 'post publish at',
                    }}
                  />
                )}
              />
              <Box mb={2}>
                <Controller
                  name="hideDate"
                  defaultValue={post.hideDate}
                  control={control}
                  render={({value, onChange}) => (
                    <Switch
                      checked={value}
                      onChange={onChangeCheckedHandler(onChange)}
                      arial-label="toggle hide date"
                      labelPlacement="end"
                      color="primary"
                      label="Hide Date"
                    />
                  )}
                />
              </Box>
              <Controller
                name="content"
                defaultValue={post.content}
                control={control}
                render={({value, onChange}) => (
                  <StyledTextEditor data={value} onChange={onChange} />
                )}
              />
              <AttachmentConfig
                post={post}
                control={control}
                register={register}
                attachment={attachment}
              />
              <SaveButton />
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
      </form>
    </ComponentConfig>
  )
}

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[2]}!important;
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const StyledTextEditor = styled(TextEditor)`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
