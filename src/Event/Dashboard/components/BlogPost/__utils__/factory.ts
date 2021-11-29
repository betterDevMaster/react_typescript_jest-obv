import {createHashMap} from 'lib/list'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import faker from 'faker'

export const fakeBlogPost = (overrides?: Partial<BlogPost>): BlogPost => ({
  title: faker.lorem.lines(1),
  postedAt: faker.date.past().toISOString(),
  publishAt: null,
  content: `
    <div>
      <p>
        ${faker.lorem.paragraph()}
      </p>
    </div>
  `,
  isVisible: true,
  formId: null,
  ...overrides,
})

export function withBlogPosts<
  T extends {
    blogPosts: Record<string, BlogPost>
  }
>(dashboard: T): T {
  const posts = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeBlogPost,
  )

  return {
    ...dashboard,
    blogPosts: createHashMap(posts),
  }
}
