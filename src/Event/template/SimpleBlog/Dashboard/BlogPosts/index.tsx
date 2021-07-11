import {BlogPost} from 'Event/template/SimpleBlog/Dashboard/BlogPosts/BlogPost'
import styled from 'styled-components'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import React, {useState} from 'react'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddBlogPostButton from 'Event/Dashboard/components/BlogPost/AddBlogPostButton'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'
import {sortedByDate} from 'Event/Dashboard/components/BlogPost'
import {useToggle} from 'lib/toggle'
import Button from '@material-ui/core/Button'
import PostStylesConfig from 'Event/template/SimpleBlog/Dashboard/BlogPosts/PostStylesConfig'
import {EditPost} from 'Event/Dashboard/components/BlogPost/BlogPostConfig'

export default function BlogPosts() {
  const {template} = useSimpleBlog()
  const {blogPosts: posts} = template
  const {flag: styleConfigVisible, toggle: toggleStyleConfig} = useToggle()

  const [editing, setEditing] = useState<string | null>(null)

  const sortedIds = sortedByDate(posts)

  return (
    <div>
      <EditPost id={editing} onClose={() => setEditing(null)} />
      <EditModeOnly>
        <StyledEditPostStylesButton onClick={toggleStyleConfig} />
        <StyledAddBlogPostButton />
        <PostStylesConfig
          isVisible={styleConfigVisible}
          onClose={toggleStyleConfig}
        />
      </EditModeOnly>
      {sortedIds.map((id, index) => {
        const post = posts.entities[id]

        const isLast = index === sortedIds.length - 1

        return (
          <Editable key={id} onEdit={() => setEditing(id)}>
            <Published component={post}>
              <HiddenOnMatch rules={post.rules}>
                <BlogPost post={post} isLast={isLast} />
              </HiddenOnMatch>
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
}) {
  return (
    <Button
      className={props.className}
      fullWidth
      size="large"
      variant="contained"
      color="primary"
      aria-label="style posts"
      onClick={props.onClick}
    >
      Edit Post Styles
    </Button>
  )
}

const StyledAddBlogPostButton = styled(AddBlogPostButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`

const StyledEditPostStylesButton = styled(EditPostStylesButton)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
`
