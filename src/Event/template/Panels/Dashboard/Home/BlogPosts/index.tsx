import {sortedByDate} from 'Event/Dashboard/components/BlogPost'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import Published from 'Event/Dashboard/editor/views/Published'
import {usePanels} from 'Event/template/Panels'
import AddBlogPostButton from 'Event/template/Panels/Dashboard/Home/BlogPosts/AddBlogPostButton'
import BlogPost from 'Event/template/Panels/Dashboard/Home/BlogPosts/BlogPost'
import {BlogPostConfig} from 'Event/template/Panels/Dashboard/Home/BlogPosts/BlogPostConfig'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'
import React, {useState} from 'react'
import styled from 'styled-components'

export default function BlogPosts() {
  const {
    template: {blogPosts},
  } = usePanels()

  const [editingId, setEditingId] = useState<string | null>(null)
  const stopEditing = () => setEditingId(null)

  const sortedIds = sortedByDate(blogPosts)

  return (
    <>
      <BlogPostConfig targetId={editingId} onClose={stopEditing} />
      <EditModeOnly>
        <StyledAddBlogPostButton onAdd={setEditingId} />
      </EditModeOnly>
      {sortedIds.map((id) => {
        const post = blogPosts.entities[id]
        return (
          <Editable onEdit={() => setEditingId(id)} key={id}>
            <Published component={post}>
              <HiddenOnMatch rules={post.rules}>
                <BlogPost post={post} />
              </HiddenOnMatch>
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
