import {BlogPost} from 'Dashboard/components/BlogPost'
import React from 'react'

export default function BlogPosts(props: {posts: BlogPost[]}) {
  return (
    <div>
      {props.posts.map((post, index) => (
        <BlogPost key={index} {...post} />
      ))}
    </div>
  )
}
