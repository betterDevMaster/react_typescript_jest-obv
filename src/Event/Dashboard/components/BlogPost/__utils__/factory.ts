import {BlogPost} from 'Event/Dashboard/components/BlogPost'

import faker from 'faker'
import {createEntityList, EntityList} from 'lib/list'

export const fakeBlogPost = (overrides?: Partial<BlogPost>): BlogPost => ({
  title: faker.lorem.lines(1),
  postedAt: faker.date.past().toISOString(),
  publishAt:
    faker.random.boolean() === true
      ? faker.date.past().toISOString()
      : faker.date.future().toISOString(),
  content: `
    <div>
      <p>
        ${faker.lorem.paragraph()}
      </p>
    </div>
  `,
  isVisible: faker.random.boolean(),
  ...overrides,
})

export function withBlogPosts<
  T extends {
    blogPosts: EntityList<BlogPost>
  }
>(dashboard: T): T {
  const posts = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeBlogPost,
  )

  return {
    ...dashboard,
    blogPosts: createEntityList(posts),
  }
}
