import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {v4 as uid} from 'uuid'
import {HasRules} from 'Event/attendee-rules'
import {getDiffDatetime, now} from 'lib/date-time'
import {REMOVE, useTemplateUpdate} from 'Event/TemplateUpdateProvider'

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
  }

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
