import {BlogPost} from 'Event/template/SimpleBlog/Dashboard/BlogPosts/BlogPost'
import styled from 'styled-components'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import React, {useState} from 'react'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddBlogPostButton from 'Event/Dashboard/components/BlogPost/AddBlogPostButton'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {sortedIdsByDate} from 'Event/Dashboard/components/BlogPost'
import PostStylesConfig from 'Event/template/SimpleBlog/Dashboard/BlogPosts/PostStylesConfig'
import {EditPost} from 'Event/Dashboard/components/BlogPost/BlogPostConfig'
import PostFormStylesConfig from 'Event/template/SimpleBlog/Dashboard/BlogPosts/PostFormStylesConfig'

export default function BlogPosts() {
  const template = useSimpleBlogTemplate()
  const {blogPosts: posts} = template

  const [editing, setEditing] = useState<string | null>(null)

  const sortedIds = sortedIdsByDate(posts)

  return (
    <div>
      <EditPost id={editing} onClose={() => setEditing(null)} />
      <EditModeOnly>
        <PostStylesConfig />
        <PostFormStylesConfig />
        <StyledAddBlogPostButton />
      </EditModeOnly>
      {sortedIds.map((id, index) => {
        const post = posts[id]

        const isLast = index === sortedIds.length - 1

        return (
          <Editable key={id} onEdit={() => setEditing(id)}>
            <Published component={post}>
              <VisibleOnMatch rules={post.rules}>
                <BlogPost post={post} isLast={isLast} />
              </VisibleOnMatch>
            </Published>
          </Editable>
        )
      })}
    </div>
  )
}

const StyledAddBlogPostButton = styled(AddBlogPostButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
