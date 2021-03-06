import {
  PointsSummaryProps,
  POINTS_SUMMARY,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/PointsSummary'
import faker from 'faker'

export const fakePoints = (
  overrides?: Partial<PointsSummaryProps>,
): PointsSummaryProps => ({
  type: POINTS_SUMMARY,
  description: faker.lorem.paragraph(1),
  summary: '',
  ...overrides,
})
