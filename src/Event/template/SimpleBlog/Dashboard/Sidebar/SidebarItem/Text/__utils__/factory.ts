import {
  TextProps,
  TEXT,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/Text'
import faker from 'faker'

export const fakeText = (overrides?: Partial<TextProps>): TextProps => ({
  type: TEXT,
  body: faker.lorem.paragraph(1),
  padding: faker.random.number({min: 0, max: 16}),
  ...overrides,
})
