import {SimpleBlogDashboard, SIMPLE_BLOG} from 'Dashboard/templates/SimpleBlog'
import faker from 'faker'
import {fakeMainNavButton} from 'Dashboard/components/MainNavButton/__utils__/factory'

export const fakeSimpleBlog = (
  overrides?: Partial<SimpleBlogDashboard>,
): SimpleBlogDashboard => ({
  template: SIMPLE_BLOG,
  title: faker.company.companyName(),
  logo: 'https://tax.live/success_summit/images/virtual-2020-logo.png',
  welcomeText: 'WELCOME TO THE DASHBOARD',
  primaryColor: '#14aecf',
  sidebar: {
    background: '#000000',
  },
  mainNavButtons: Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeMainNavButton,
  ),
  blogPosts: [],
  ...overrides,
})
