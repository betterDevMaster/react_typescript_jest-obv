import {BlogPost, BLOG_POST} from 'Event/Dashboard/components/BlogPost'
import styled from 'styled-components'
import {useDashboard} from 'Event/Dashboard/state/DashboardProvider'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import React from 'react'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddBlogPostButton from 'Event/Dashboard/Template/SimpleBlog/BlogPosts/AddBlogPostButton'

export default function BlogPosts() {
  const {blogPosts: posts} = useDashboard()
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
            <BlogPost post={post} />
          </EditComponent>
        )
      })}
    </div>
  )
}

const StyledAddBlogPostButton = styled(AddBlogPostButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
