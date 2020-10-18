import {BlogPost, BLOG_POST} from 'Dashboard/components/BlogPost'
import {useCurrent} from 'Dashboard/edit/state/edit-mode'
import EditComponent from 'Dashboard/edit/views/EditComponent'
import {EntityList} from 'lib/list'
import React from 'react'

export default function BlogPosts(props: {posts: EntityList<BlogPost>}) {
  const posts = useCurrent(
    (state) => state.dashboardEditor.blogPosts,
    props.posts,
  )

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
