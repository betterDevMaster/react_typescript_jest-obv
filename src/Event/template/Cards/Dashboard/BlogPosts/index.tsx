import {BlogPost} from 'Event/template/Cards/Dashboard/BlogPosts/BlogPost'
import styled from 'styled-components'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import React, {useState} from 'react'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddBlogPostButton from 'Event/Dashboard/components/BlogPost/AddBlogPostButton'
import {useCards} from 'Event/template/Cards'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {sortedByDate} from 'Event/Dashboard/components/BlogPost'
import {useToggle} from 'lib/toggle'
import Button from '@material-ui/core/Button'
import PostStylesConfig from 'Event/template/Cards/Dashboard/BlogPosts/PostStylesConfig'
import PostFormStylesConfig from 'Event/template/Cards/Dashboard/BlogPosts/PostFormStylesConfig'
import {EditPost} from 'Event/Dashboard/components/BlogPost/BlogPostConfig'

export default function BlogPosts() {
  const {template} = useCards()
  const {blogPosts: posts} = template
  const {flag: styleConfigVisible, toggle: toggleStyleConfig} = useToggle()
  const {
    flag: styleFormConfigVisible,
    toggle: toggleStyleFormConfig,
  } = useToggle()

  const [editing, setEditing] = useState<string | null>(null)

  const sortedIds = sortedByDate(posts)

  return (
    <div>
      <EditPost id={editing} onClose={() => setEditing(null)} />
      <EditModeOnly>
        <StyledEditPostStylesButton
          onClick={toggleStyleConfig}
          text="Edit Post Styles"
          aria-label="style posts"
        />
        <StyledEditPostStylesButton
          onClick={toggleStyleFormConfig}
          text="Edit Post Form Styles"
          aria-label="style posts form"
        />
        <StyledAddBlogPostButton />
        <PostStylesConfig
          isVisible={styleConfigVisible}
          onClose={toggleStyleConfig}
        />
        <PostFormStylesConfig
          isVisible={styleFormConfigVisible}
          onClose={toggleStyleFormConfig}
        />
      </EditModeOnly>
      {sortedIds.map((id, index) => {
        const post = posts.entities[id]

        const isLast = index === sortedIds.length - 1

        return (
          <Editable key={id} onEdit={() => setEditing(id)}>
            <Published component={post}>
              <VisibleOnMatch rules={post.rules}>
                <BlogPost post={post} isLast={isLast} />
              </VisibleOnMatch>
            </Published>
          </Editable>
        )
      })}
    </div>
  )
}

function EditPostStylesButton(props: {
  onClick: () => void
  className?: string
  text: string
  ['aria-label']: string
}) {
  return (
    <Button
      className={props.className}
      fullWidth
      size="large"
      variant="contained"
      color="primary"
      aria-label={props['aria-label']}
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  )
}

const StyledAddBlogPostButton = styled(AddBlogPostButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`

const StyledEditPostStylesButton = styled(EditPostStylesButton)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
`
