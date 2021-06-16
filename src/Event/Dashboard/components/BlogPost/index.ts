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

export function useCreatePost() {
  const {blogPosts} = useTemplate()
  const updateTemplate = useDispatchUpdate()

  const create = () => {
    const id = uid()
    const post: BlogPost = {
      title: 'My Post',
      postedAt: now(),
      publishAt: null,
      content: '',
      isVisible: true,
      hideDate: true,
    }

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

    return Promise.resolve(id)
  }

  return create
}

export function useUpdatePost({
  list,
  id,
}: {
  list: EntityList<BlogPost>
  id: string | null
}) {
  const updateTemplate = useDispatchUpdate()

  return <T extends keyof BlogPost>(key: T) => (value: BlogPost[T]) => {
    if (!id) {
      throw new Error('Missing target id to update blog post')
    }

    const post = list.entities[id]

    const updated: BlogPost = {
      ...post,
      [key]: value,
    }

    updateTemplate({
      blogPosts: {
        ...list,
        entities: {
          ...list.entities,
          [id]: updated,
        },
      },
    })
  }
}

export function useRemovePost({
  list,
  id,
}: {
  list: EntityList<BlogPost>
  id: string | null
}) {
  const updateTemplate = useDispatchUpdate()

  return () => {
    if (!id) {
      throw new Error('Missing id to remove blog post')
    }

    const {[id]: target, ...otherPosts} = list.entities
    const updatedIds = list.ids.filter((i) => i !== id)

    updateTemplate({
      blogPosts: {
        entities: otherPosts,
        ids: updatedIds,
      },
    })

    return Promise.resolve()
  }
}
