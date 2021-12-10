import {v4 as uuid} from 'uuid'
import React from 'react'
import Button from '@material-ui/core/Button'
import NavButton from 'Event/Dashboard/components/NavButton'
import {useTemplateUpdate} from 'Event/TemplateUpdateProvider'

export default function AddBlogPostButtonButton(props: {postId: string}) {
  const {postId} = props
  const update = useTemplateUpdate()

  const add = () => {
    const newButton: NavButton = {
      text: 'Button',
      link: '',
      rules: [],
      isAreaButton: false,
      isImageUpload: false,
      areaId: null,
      actionId: null,
      isVisible: true,
      infusionsoftTag: null,
      mailchimpTag: null,
      fontSize: 16,
      padding: 8,
      zapierTag: null,
    }

    const id = uuid()

    update({
      blogPosts: {
        [postId]: {
          buttons: {
            [id]: newButton,
          },
        },
      },
    })
  }

  return (
    <Button
      color="primary"
      aria-label="add new button"
      onClick={add}
      variant="outlined"
      fullWidth
    >
      Add Button
    </Button>
  )
}
