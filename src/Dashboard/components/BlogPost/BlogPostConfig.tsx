import {BlogPost} from 'Dashboard/components/BlogPost'
import styled from 'styled-components'
import {
  useCloseConfig,
  useUpdateDashboard,
} from 'Dashboard/edit/state/edit-mode'
import {Config} from 'Dashboard/edit/views/DashboardEditDialog/ConfigComponent'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import DangerButton from 'lib/ui/Button/DangerButton'

export default function BlogPostConfig(props: {id: Config['id']}) {
  const posts = useSelector(
    (state: RootState) => state.dashboardEditor.blogPosts,
  )

  const {id} = props
  const updateDashboard = useUpdateDashboard()
  const closeConfig = useCloseConfig()

  if (!id) {
    throw new Error('Missing post id; was it passed through when calling edit?')
  }

  if (!posts) {
    throw new Error('Missing blog posts; was it set via edit?')
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
