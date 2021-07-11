import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {v4 as uid} from 'uuid'
import {useDispatchUpdate, useTemplate} from 'Event/TemplateProvider'
import {HasRules} from 'Event/visibility-rules'
import {getDiffDatetime, now} from 'lib/date-time'
import {EntityList} from 'lib/list'

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
  const updateTemplate = useDispatchUpdate()
  const {blogPosts: current} = useTemplate()

  return (id: string, updated: BlogPost) => {
    updateTemplate({
      blogPosts: {
        ...current,
        entities: {
          ...current.entities,
          [id]: updated,
        },
      },
    })
  }
}

export function useInsertPost() {
  const updateTemplate = useDispatchUpdate()
  const {blogPosts} = useTemplate()

  return (post: BlogPost) => {
    const id = uid()

    const entities = {
      ...blogPosts.entities,
      [id]: post,
    }
    const ids = [id, ...blogPosts.ids]

    updateTemplate({
      blogPosts: {
        entities,
        ids,
      },
    })
  }
}

export function useRemovePost() {
  const updateTemplate = useDispatchUpdate()
  const {blogPosts} = useTemplate()

  return (id: string) => {
    const {[id]: target, ...otherPosts} = blogPosts.entities
    const updatedIds = blogPosts.ids.filter((i) => i !== id)

    updateTemplate({
      blogPosts: {
        entities: otherPosts,
        ids: updatedIds,
      },
    })
  }
}