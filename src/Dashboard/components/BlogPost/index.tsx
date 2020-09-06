import React from 'react'

export default interface BlogPost {
  title: string
  postedAt: string
  content: string
}

export function BlogPost(props: BlogPost) {
  return (
    <div>
      <h5>{props.title}</h5>
    </div>
  )
}
