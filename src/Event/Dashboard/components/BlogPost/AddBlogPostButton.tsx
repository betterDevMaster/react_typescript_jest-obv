import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import BlogPostConfig from 'Event/Dashboard/components/BlogPost/BlogPostConfig'
import {now} from 'lib/date-time'

export default function AddBlogPostButton(props: {className?: string}) {
  const [post, setPost] = useState<BlogPost | null>(null)

  const newPost = (): BlogPost => ({
    title: 'My Post',
    postedAt: now(),
    publishAt: null,
    content: '',
    isVisible: true,
    hideDate: true,
  })

  const clearPost = () => setPost(null)

  return (
    <>
      <NewPostConfig post={post} onClose={clearPost} />
      <Button
        className={props.className}
        fullWidth
        size="large"
        variant="outlined"
        color="primary"
        aria-label="add blog post"
        onClick={() => setPost(newPost())}
      >
        Add Blog post
      </Button>
    </>
  )
}

function NewPostConfig(props: {post: BlogPost | null; onClose: () => void}) {
  const {post, onClose} = props
  if (!post) {
    return null
  }

  return <BlogPostConfig post={post} onClose={onClose} isVisible />
}
