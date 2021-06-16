import React from 'react'
import Button from '@material-ui/core/Button'
import {useCreatePost} from 'Event/Dashboard/components/BlogPost'

export default function AddBlogPostButton(props: {
  className?: string
  onAdd: (id: string) => void
}) {
  const createPost = useCreatePost()
  const addPost = () => createPost().then(props.onAdd)

  return (
    <Button
      className={props.className}
      fullWidth
      size="large"
      variant="outlined"
      color="primary"
      aria-label="add blog post"
      onClick={addPost}
    >
      Add Blog post
    </Button>
  )
}
