import {BlogPost, BLOG_POST} from 'Event/Dashboard/components/BlogPost'
import styled from 'styled-components'
import {useTemplate} from 'Event/TemplateProvider'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'

import React from 'react'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import AddBlogPostButton from 'Event/template/SimpleBlog/Dashboard/BlogPosts/AddBlogPostButton'
import {getDiffDatetime} from 'lib/date-time'
import {SimpleBlog} from 'Event/template/SimpleBlog'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'

export default function BlogPosts() {
  const {blogPosts: posts} = useTemplate()

  const sortedIds = sortPosts(posts)

  return (
    <div>
      <EditModeOnly>
        <StyledAddBlogPostButton />
      </EditModeOnly>
      {sortedIds.map((id) => {
        const post = posts.entities[id]
        return (
          <EditComponent
            key={id}
            component={{
              type: BLOG_POST,
              id,
            }}
          >
            <Published component={post}>
              <HiddenOnMatch rules={post.rules}>
                <BlogPost post={post} />
              </HiddenOnMatch>
            </Published>
          </EditComponent>
        )
      })}
    </div>
  )
}

function sortPosts(posts: SimpleBlog['blogPosts']) {
  return posts.ids.sort((a: string, b: string) => {
    const postA = posts.entities[a]
    const postB = posts.entities[b]

    const date = (post: BlogPost) => {
      return post.publishAt || post.postedAt
    }

    const diff = getDiffDatetime(date(postA), date(postB))

    // newer comes first
    if (diff > 0) {
      return -1
    }

    //older
    if (diff < 0) {
      return 1
    }

    return 1
  })
}

const StyledAddBlogPostButton = styled(AddBlogPostButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
