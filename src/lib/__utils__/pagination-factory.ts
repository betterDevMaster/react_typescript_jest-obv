import {PaginatedCollection} from 'lib/api-client'
import faker from 'faker'

export const fakePaginate = <T>(
  overrides?: Partial<PaginatedCollection<T>>,
): PaginatedCollection<T> => ({
  current_page: 1,
  data: [],
  first_page_url: faker.internet.url(),
  from: 1,
  last_page: 1,
  last_page_url: faker.internet.url(),
  next_page_url: null,
  path: '/some/path',
  per_page: 20,
  prev_page_url: null,
  to: 20,
  total: 20,
  ...overrides,
})
