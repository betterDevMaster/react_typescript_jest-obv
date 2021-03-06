import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import {BlogPost} from 'Event/Dashboard/components/BlogPosts'
import BlogPostConfig from 'Event/Dashboard/components/BlogPosts/BlogPostConfig'
import {now} from 'lib/date-time'
import {DeepRequired} from 'lib/type-utils'

export const newPost = (): DeepRequired<BlogPost> => ({
  title: 'My Post',
  postedAt: now(),
  publishAt: null,
  content: '',
  isVisible: true,
  hideDate: true,
  buttons: {},
  rules: [],
  formId: null,
  isModalForm: false,
  modalButtonText: 'Submit',
  buttonsPosition: 'center',
  attachment: 'form',
  buttonsWidth: 100,
  backgroundColor: '#FFFFFF',
  backgroundOpacity: 0,
})

export const blogPostDefaults = newPost()

export default function AddBlogPostButton(props: {className?: string}) {
  const [post, setPost] = useState<DeepRequired<BlogPost> | null>(null)

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

function NewPostConfig(props: {
  post: DeepRequired<BlogPost> | null
  onClose: () => void
}) {
  const {post, onClose} = props
  if (!post) {
    return null
  }

  return <BlogPostConfig post={post} onClose={onClose} isVisible />
}
