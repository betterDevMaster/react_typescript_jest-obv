import {BlogPost, BLOG_POST} from 'Dashboard/components/BlogPost'
import {useDashboard} from 'Dashboard/state/DashboardProvider'
import EditComponent from 'editor/views/EditComponent'
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
