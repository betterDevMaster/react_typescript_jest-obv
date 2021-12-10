import Published, {Publishable} from 'Event/Dashboard/editor/views/Published'
import styled from 'styled-components'
import React from 'react'
import {v4 as uid} from 'uuid'
import {HasRules} from 'Event/attendee-rules'
import {getDiffDatetime, now} from 'lib/date-time'
import {REMOVE, useTemplateUpdate} from 'Event/TemplateUpdateProvider'
import NavButton from 'Event/Dashboard/components/NavButton'
import {HashMap} from 'lib/list'
import {withDefaults} from 'lib/object'
import {DeepRequired} from 'lib/type-utils'
import {blogPostDefaults} from 'Event/Dashboard/components/BlogPosts/AddBlogPostButton'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useState} from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import PostFormStylesConfig from 'Event/Dashboard/components/BlogPosts/PostFormStylesConfig'
import PostStylesConfig from 'Event/Dashboard/components/BlogPosts/PostStylesConfig'
import AddBlogPostButton from 'Event/Dashboard/components/BlogPosts/AddBlogPostButton'
import {EditPost} from 'Event/Dashboard/components/BlogPosts/BlogPostConfig'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'

export type BlogPost = Publishable &
  HasRules & {
    title: string
    postedAt: string
    publishAt: string | null
    content: string
    formId?: number | null
    isModalForm?: boolean
    modalButtonText?: string
    hideDate?: boolean
    buttons: HashMap<NavButton>
    attachment?: BlogPostAttachment
    buttonsPosition?: 'flex-right' | 'center' | 'flex-end'
    buttonsWidth?: number
  }

export type BlogPostProps = {
  post: BlogPost
  isLast: boolean
  postId: string
}

export function BlogPostList(props: {
  children: (props: BlogPostProps) => JSX.Element
}) {
  const template = useTemplate()
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
                <ShowOnDate post={post}>
                  {props.children({
                    isLast,
                    post,
                    postId: id,
                  })}
                </ShowOnDate>
              </VisibleOnMatch>
            </Published>
          </Editable>
        )
      })}
    </div>
  )
}

function ShowOnDate(props: {post: BlogPost; children: JSX.Element}) {
  const {post} = props

  const editMode = useEditMode()
  const showing = editMode || shouldPublish(post)

  if (!showing) {
    return null
  }

  return props.children
}

/**
 * Blog post can have attachments that come after the text. There should
 * only be one type of attachment, ie. either shows a form, or
 * buttons, but not both.
 */

export const FORM = 'form'
export const BUTTONS = 'buttons'
export type BlogPostAttachment = typeof FORM | typeof BUTTONS

/**
 * Checks whether a post should be published (visible), depending
 * on the post's 'publishAt' property.
 * @param post
 * @returns
 */
export function shouldPublish(post: BlogPost) {
  if (!post.publishAt) {
    return true
  }

  // is past publish date
  return getDiffDatetime(post.publishAt, now()) < 0
}

export function sortedIdsByDate(posts: Record<string, BlogPost>) {
  return Object.entries(posts)
    .sort(([aId, aPost], [bId, bPost]) => {
      const date = (post: BlogPost) => {
        return post.publishAt || post.postedAt
      }

      const diff = getDiffDatetime(date(aPost), date(bPost))

      // newer comes first
      if (diff > 0) {
        return -1
      }

      // is older
      if (diff < 0) {
        return 1
      }

      return 1
    })
    .map(([id]) => id)
}

export function useUpdatePost() {
  const updateTemplate = useTemplateUpdate()

  return (id: string, updated: BlogPost) => {
    updateTemplate({
      blogPosts: {
        [id]: updated,
      },
    })
  }
}

export function useInsertPost() {
  const updateTemplate = useTemplateUpdate()

  return (post: BlogPost) => {
    const id = uid()

    updateTemplate({
      blogPosts: {
        [id]: post,
      },
    })
  }
}

export function useRemovePost() {
  const updateTemplate = useTemplateUpdate()

  return (id: string) => {
    updateTemplate({
      blogPosts: {
        [id]: REMOVE,
      },
    })
  }
}

export function fillBlogPostDefaults(blogPosts: HashMap<BlogPost>) {
  return Object.entries(blogPosts).reduce((acc, [id, post]) => {
    acc[id] = withDefaults(blogPostDefaults, post) as DeepRequired<BlogPost>
    return acc
  }, {} as DeepRequired<HashMap<BlogPost>>)
}

const StyledAddBlogPostButton = styled(AddBlogPostButton)`
  margin-bottom: ${(props) => props.theme.spacing[5]}!important;
`
