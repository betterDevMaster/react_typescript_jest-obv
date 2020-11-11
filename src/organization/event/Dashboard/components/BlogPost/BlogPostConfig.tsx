import {BlogPost} from 'organization/event/Dashboard/components/BlogPost'
import styled from 'styled-components'
import {useCloseConfig} from 'organization/event/Dashboard/editor/state/edit-mode'
import {Config} from 'organization/event/Dashboard/editor/views/DashboardEditDialog/ConfigComponent'
import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import DangerButton from 'lib/ui/Button/DangerButton'
import {
  useDashboard,
  useUpdateDashboard,
} from 'organization/event/Dashboard/state/DashboardProvider'

export default function BlogPostConfig(props: {id: Config['id']}) {
  const {blogPosts: posts} = useDashboard()

  const {id} = props
  const updateDashboard = useUpdateDashboard()
  const closeConfig = useCloseConfig()

  if (!id) {
    throw new Error('Missing post id; was it passed through when calling edit?')
  }

  const post = posts.entities[id]

  const update = <T extends keyof BlogPost>(key: T) => (value: BlogPost[T]) =>
    updateDashboard({
      blogPosts: {
        ...posts,
        entities: {
          ...posts.entities,
          [id]: {
            ...post,
            [key]: value,
          },
        },
      },
    })

  const save = (_: any, editor: any) => update('content')(editor.getData())

  const remove = () => {
    const {[id]: target, ...otherPosts} = posts.entities
    const updatedIds = posts.ids.filter((i) => i !== id)

    closeConfig()
    updateDashboard({
      blogPosts: {
        entities: otherPosts,
        ids: updatedIds,
      },
    })
  }

  return (
    <>
      <EditorContainer>
        <CKEditor editor={ClassicEditor} data={post.content} onChange={save} />
        <RemoveButton
          fullWidth
          variant="outlined"
          aria-label="remove button"
          onClick={remove}
        >
          DELETE POST
        </RemoveButton>
      </EditorContainer>
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

const RemoveButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[5]}!important;
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
