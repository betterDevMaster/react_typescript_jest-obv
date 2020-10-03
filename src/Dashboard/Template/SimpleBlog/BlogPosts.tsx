import {BlogPost} from 'Dashboard/components/BlogPost'
import {EntityList} from 'lib/list'
import React from 'react'

export default function BlogPosts(props: {posts: EntityList<BlogPost>}) {
  return (
    <div>
      {props.posts.ids.map((id) => {
        const post = props.posts.entities[id]
        return <BlogPost key={id} {...post} />
      })}
    </div>
  )
}
