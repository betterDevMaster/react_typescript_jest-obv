import {BlogPost} from 'Dashboard/components/BlogPost'

import faker from 'faker'

export const fakeBlogPost = (): BlogPost => ({
  title: faker.lorem.lines(1),
  postedAt: faker.date.past().toISOString(),
  content: `
    <div>
      <p>
        ${faker.lorem.paragraph()}
      </p>
    </div>
  `,
})

export function withBlogPosts<
  T extends {
    blogPosts: BlogPost[]
  }
>(dashboard: T): T {
  return {
    ...dashboard,
    blogPosts: Array.from(
      {length: faker.random.number({min: 1, max: 5})},
      fakeBlogPost,
    ),
  }
}
