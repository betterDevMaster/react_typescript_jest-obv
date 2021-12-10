import {BlogPost} from 'Event/Dashboard/components/BlogPosts'
import {AttachmentConfigProps} from 'Event/Dashboard/components/BlogPosts/BlogPostConfig/AttachmentConfig'
import React from 'react'
import {REMOVE} from 'Event/TemplateUpdateProvider'
import {DeepPartialSubstitute, DeepRequired} from 'lib/type-utils'
import ButtonsListConfig from 'Event/Dashboard/components/BlogPosts/BlogPostConfig/AttachmentConfig/ButtonsConfig/ButtonsListConfig'

export default function ButtonsConfig(
  props: {
    buttons: DeepRequired<BlogPost>['buttons']
    onChange: (
      buttons: DeepPartialSubstitute<BlogPost['buttons'], typeof REMOVE>,
    ) => void
  } & AttachmentConfigProps,
) {
  const {attachment} = props

  // If attachment is not set to 'buttons' we'll hide
  // buttons, and any config.
  if (attachment !== 'buttons') {
    return null
  }

  return <ButtonsListConfig {...props} />
}
