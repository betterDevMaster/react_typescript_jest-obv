import {sortedIdsByDate} from 'Event/Dashboard/components/BlogPost'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import Published from 'Event/Dashboard/editor/views/Published'
import {usePanelsTemplate} from 'Event/template/Panels'
import BlogPost from 'Event/template/Panels/Dashboard/Home/BlogPosts/BlogPost'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import React, {useState} from 'react'
import styled from 'styled-components'
import AddBlogPostButton from 'Event/Dashboard/components/BlogPost/AddBlogPostButton'
import PostStylesConfig from 'Event/template/Panels/Dashboard/Home/BlogPosts/PostStylesConfig'
import PostFormStylesConfig from 'Event/template/Panels/Dashboard/Home/BlogPosts/PostFormStylesConfig'
import {EditPost} from 'Event/Dashboard/components/BlogPost/BlogPostConfig'

export default function BlogPosts() {
  const {blogPosts} = usePanelsTemplate()

  const [editing, setEditing] = useState<string | null>(null)
  const stopEditing = () => setEditing(null)

  const sortedIds = sortedIdsByDate(blogPosts)

  return (
    <>
      <EditPost id={editing} onClose={stopEditing} />
      <EditModeOnly>
        <PostStylesConfig />
        <PostFormStylesConfig />
        <StyledAddBlogPostButton />
      </EditModeOnly>
      {sortedIds.map((id) => {
        const post = blogPosts[id]
        return (
          <Editable onEdit={() => setEditing(id)} key={id}>
            <Published component={post}>
              <VisibleOnMatch rules={post.rules}>
                <BlogPost post={post} />
              </VisibleOnMatch>
            </Published>
          </Editable>
        )
      })}
    </>
  )
}

const StyledAddBlogPostButton = styled(AddBlogPostButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
