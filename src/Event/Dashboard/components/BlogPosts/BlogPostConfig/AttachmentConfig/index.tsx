import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import React from 'react'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import {BlogPost, BUTTONS, FORM} from 'Event/Dashboard/components/BlogPosts'
import {FormConfig} from './FormConfig'
import {DeepRequired} from 'lib/type-utils'
import {Controller, UseFormMethods} from 'react-hook-form'
import ButtonsConfig from 'Event/Dashboard/components/BlogPosts/BlogPostConfig/AttachmentConfig/ButtonsConfig'
import InputLabel from '@material-ui/core/InputLabel'

export type AttachmentConfigProps = {
  post: DeepRequired<BlogPost>
  attachment: NonNullable<BlogPost['attachment']>
} & Pick<UseFormMethods, 'control' | 'register'>

export default function AttachmentConfig(props: AttachmentConfigProps) {
  const {post, control} = props

  return (
    <>
      <AttachmentLabel>Attachment</AttachmentLabel>
      <FormControl>
        <Controller
          name="attachment"
          defaultValue={post.attachment}
          control={control}
          render={({value, onChange}) => (
            <ToggleButtonGroup value={value} exclusive>
              <ToggleButton value={FORM} onClick={() => onChange(FORM)}>
                Form
              </ToggleButton>
              <ToggleButton
                value={BUTTONS}
                aria-label="add buttons for a blog post"
                onClick={() => onChange(BUTTONS)}
              >
                Buttons
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        />
      </FormControl>
      <FormConfig {...props} />
      <Controller
        name="buttons"
        defaultValue={post.buttons}
        control={control}
        render={({value, onChange}) => (
          <ButtonsConfig
            {...props}
            buttons={value}
            onChange={(data) => {
              console.log(data)
              onChange(data)
            }}
          />
        )}
      />
    </>
  )
}

const AttachmentLabel = styled(InputLabel)`
  margin-bottom: ${(props) => props.theme.spacing[2]};
`
