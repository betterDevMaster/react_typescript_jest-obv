import {createFiftyBlog, FiftyBlog} from 'Event/template/FiftyBlog'

export const fakeFiftyBlog = (overrides?: Partial<FiftyBlog>): FiftyBlog => ({
  ...createFiftyBlog(),
  ...overrides,
})
