import {sortedByDate} from 'Event/Dashboard/components/BlogPost'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import Published from 'Event/Dashboard/editor/views/Published'
import {usePanels} from 'Event/template/Panels'
import BlogPost from 'Event/template/Panels/Dashboard/Home/BlogPosts/BlogPost'
import {EditPost} from 'Event/Dashboard/components/BlogPost/BlogPostConfig'
import VisibleOnMatch from 'Event/visibility-rules/VisibleOnMatch'
import React, {useState} from 'react'
import styled from 'styled-components'
import AddBlogPostButton from 'Event/Dashboard/components/BlogPost/AddBlogPostButton'

export default function BlogPosts() {
  const {
    template: {blogPosts},
  } = usePanels()

  const [editing, setEditing] = useState<string | null>(null)
  const stopEditing = () => setEditing(null)

  const sortedIds = sortedByDate(blogPosts)

  return (
    <>
      <EditPost id={editing} onClose={stopEditing} />
      <EditModeOnly>
        <StyledAddBlogPostButton />
      </EditModeOnly>
      {sortedIds.map((id) => {
        const post = blogPosts.entities[id]
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
