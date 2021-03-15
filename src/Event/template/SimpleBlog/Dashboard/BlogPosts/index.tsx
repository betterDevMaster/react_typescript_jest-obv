import {BlogPost, BLOG_POST} from 'Event/Dashboard/components/BlogPost'
import styled from 'styled-components'
import {useTemplate} from 'Event/TemplateProvider'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'

import React from 'react'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddBlogPostButton from 'Event/template/SimpleBlog/Dashboard/BlogPosts/AddBlogPostButton'

export default function BlogPosts() {
  const {blogPosts: posts} = useTemplate()
  return (
    <div>
      <EditModeOnly>
        <StyledAddBlogPostButton />
      </EditModeOnly>
      {posts.ids.map((id) => {
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
              <BlogPost post={post} />
            </Published>
          </EditComponent>
        )
      })}
    </div>
  )
}

const StyledAddBlogPostButton = styled(AddBlogPostButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
