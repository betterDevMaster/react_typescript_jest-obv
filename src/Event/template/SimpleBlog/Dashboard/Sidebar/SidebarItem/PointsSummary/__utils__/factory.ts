import {
  PointsSummaryProps,
  POINTS_SUMMARY,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/PointsSummary'
import faker from 'faker'
import {uuid} from 'lib/uuid'

export const fakePoints = (
  overrides?: Partial<PointsSummaryProps>,
): PointsSummaryProps => ({
  id: uuid(),
  type: POINTS_SUMMARY,
  description: faker.lorem.paragraph(1),
  summary: '',
  ...overrides,
})
