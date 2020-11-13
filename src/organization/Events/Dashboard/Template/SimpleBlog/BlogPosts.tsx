import {
  BlogPost,
  BLOG_POST,
} from 'organization/Events/Dashboard/components/BlogPost'
import {useDashboard} from 'organization/Events/Dashboard/state/DashboardProvider'
import EditComponent from 'organization/Events/Dashboard/editor/views/EditComponent'
import React from 'react'

export default function BlogPosts() {
  const {blogPosts: posts} = useDashboard()
  return (
    <div>
      {posts.ids.map((id) => {
        const post = posts.entities[id]
        return (
          <EditComponent key={id} type={BLOG_POST} id={id}>
            <BlogPost post={post} />
          </EditComponent>
        )
      })}
    </div>
  )
}
