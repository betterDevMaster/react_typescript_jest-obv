import {
  BlogPost,
  BLOG_POST,
} from 'Event/template/SimpleBlog/Dashboard/BlogPosts/BlogPost'
import styled from 'styled-components'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import React from 'react'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddBlogPostButton from 'Event/template/SimpleBlog/Dashboard/BlogPosts/AddBlogPostButton'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'
import {sortedByDate} from 'Event/Dashboard/components/BlogPost'
import {useToggle} from 'lib/toggle'
import Button from '@material-ui/core/Button'
import PostStylesConfig from 'Event/template/SimpleBlog/Dashboard/BlogPosts/PostStylesConfig'

export default function BlogPosts() {
  const {template} = useSimpleBlog()
  const {blogPosts: posts} = template
  const {flag: styleConfigVisible, toggle: toggleStyleConfig} = useToggle()

  const sortedIds = sortedByDate(posts)

  return (
    <div>
      <EditModeOnly>
        <StyledEditPostStylesButton onClick={toggleStyleConfig} />
        <StyledAddBlogPostButton />
        <PostStylesConfig
          isVisible={styleConfigVisible}
          onClose={toggleStyleConfig}
        />
      </EditModeOnly>
      {sortedIds.map((id) => {
        const post = posts.entities[id]
        return (
          <EditComponent
            key={id}
            component={{
              type: BLOG_POST,
              id,
            }}
          >
            <Published component={post}>
              <HiddenOnMatch rules={post.rules}>
                <BlogPost post={post} />
              </HiddenOnMatch>
            </Published>
          </EditComponent>
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
