import React from 'react'
import {onChangeCheckedHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import FormSelect from 'organization/Event/FormsProvider/FormSelect'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {AttachmentConfigProps} from 'Event/Dashboard/components/BlogPosts/BlogPostConfig/AttachmentConfig'
import {BlogPost} from 'Event/Dashboard/components/BlogPosts'
import {Controller} from 'react-hook-form'

export function FormConfig(props: AttachmentConfigProps) {
  const {post, control, register, attachment} = props

  // If attaching buttons instead of a form, we'll hide the config
  if (attachment === 'buttons') {
    return null
  }

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Form</InputLabel>
        <Controller
          name="formId"
          defaultValue={post.formId}
          control={control}
          render={({value, onChange}) => (
            <FormSelect value={value} onChange={onChange} />
          )}
        />
      </FormControl>
      <FormFields post={post}>
        <FormControl>
          <Controller
            name="isModalForm"
            defaultValue={post.isModalForm}
            control={control}
            render={({value, onChange}) => (
              <FormControlLabel
                label="Open in modal?"
                control={
                  <Checkbox
                    disableRipple
                    checked={value}
                    onChange={onChangeCheckedHandler(onChange)}
                  />
                }
              />
            )}
          />
        </FormControl>
        <IfModalForm post={post}>
          <TextField
            label="Modal Button Text"
            defaultValue={post.modalButtonText}
            inputProps={{
              'aria-label': 'open form modal text',
              ref: register,
            }}
            fullWidth
          />
        </IfModalForm>
      </FormFields>
    </>
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
