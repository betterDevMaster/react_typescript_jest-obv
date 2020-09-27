import {BlogPost} from 'Dashboard/component/BlogPost'
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
