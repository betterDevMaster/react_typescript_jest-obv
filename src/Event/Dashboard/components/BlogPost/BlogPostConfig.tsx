import {BlogPost, BLOG_POST} from 'Event/Dashboard/components/BlogPost'
import styled, {createGlobalStyle} from 'styled-components'
import {useCloseConfig} from 'Event/Dashboard/editor/state/edit-mode'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useTemplate, useUpdateTemplate} from 'Event/TemplateProvider'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import Switch from 'lib/ui/form/Switch'
import Box from '@material-ui/core/Box'
import {DateTimePicker} from '@material-ui/pickers'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import TextEditor from 'lib/ui/form/TextEditor'

export type BlogPostConfig = {
  type: typeof BLOG_POST
  id: string
}

export function BlogPostConfig(props: {id: BlogPostConfig['id']}) {
  const {blogPosts: posts} = useTemplate()

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
    <>
      <EditorContainer>
        <Box display="flex" justifyContent="flex-end">
          <Switch
            checked={post.isVisible}
            onChange={onChangeCheckedHandler(update('isVisible'))}
            arial-label="config switch to attendee"
            labelPlacement="start"
            color="primary"
            label={post.isVisible ? 'Enable' : 'Disable'}
          />
        </Box>
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

        <TextEditor data={post.content} onChange={update('content')} />
        <RemoveButton
          fullWidth
          variant="outlined"
          aria-label="remove blog post"
          onClick={remove}
        >
          DELETE POST
        </RemoveButton>
      </EditorContainer>
      <CkPopupZIndex />
    </>
  )
}

// CKEditor has a min-width, anything less will show blank whitespace
// with scroll. So we'll add a container to hide unneeded
// whitespace
const EditorContainer = styled.div`
  overflow-x: hidden;
  margin-bottom: ${(props) => props.theme.spacing[6]};
`

/*
Fix CKEditor link pop-up not appearing when inside a Dialog. Note that 
this also required setting disableEnforceFocus on the Dialog
component.
*/
const CkPopupZIndex = createGlobalStyle`
  body {
    --ck-z-modal: 1500
  }
`

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[5]}!important;
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
