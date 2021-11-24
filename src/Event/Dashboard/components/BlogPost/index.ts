import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {v4 as uid} from 'uuid'
import {useTemplate} from 'Event/TemplateProvider'
import {HasRules} from 'Event/attendee-rules'
import {getDiffDatetime, now} from 'lib/date-time'
import {EntityList} from 'lib/list'
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

export function sortedByDate(posts: EntityList<BlogPost>) {
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

    // is older
    if (diff < 0) {
      return 1
    }

    return 1
  })
}

export function useUpdatePost() {
  const updateTemplate = useTemplateUpdate()

  return (id: string, updated: BlogPost) => {
    updateTemplate({
      blogPosts: {
        entities: {
          [id]: updated,
        },
      },
    })
  }
}

export function useInsertPost() {
  const updateTemplate = useTemplateUpdate()
  const {blogPosts} = useTemplate()

  return (post: BlogPost) => {
    const id = uid()

    const ids = [id, ...blogPosts.ids]

    updateTemplate({
      blogPosts: {
        entities: {
          [id]: post,
        },
        ids,
      },
    })
  }
}

export function useRemovePost() {
  const updateTemplate = useTemplateUpdate()
  const {blogPosts} = useTemplate()

  return (id: string) => {
    const updatedIds = blogPosts.ids.filter((i) => i !== id)

    updateTemplate({
      blogPosts: {
        entities: {
          [id]: REMOVE,
        },
        ids: updatedIds,
      },
    })
  }
}
