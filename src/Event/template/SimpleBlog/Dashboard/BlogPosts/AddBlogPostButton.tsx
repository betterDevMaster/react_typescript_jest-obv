import React from 'react'
import {BLOG_POST} from 'Event/template/SimpleBlog/Dashboard/BlogPosts/BlogPost'
import {useDispatch} from 'react-redux'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import Button from '@material-ui/core/Button'
import {useCreatePost} from 'Event/Dashboard/components/BlogPost'

export default function AddBlogPostButton(props: {className?: string}) {
  const dispatch = useDispatch()
  const create = useCreatePost()

  const addPost = () =>
    create().then((id) => dispatch(setConfig({type: BLOG_POST, id})))

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
