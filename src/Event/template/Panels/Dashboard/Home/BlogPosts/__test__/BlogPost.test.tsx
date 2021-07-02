import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {fakeBlogPost} from 'Event/Dashboard/components/BlogPost/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent, wait} from '@testing-library/react'
import {emptyActions, render} from '__utils__/render'
import {fakeEvent} from 'Event/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import {getDiffDatetime, now} from 'lib/date-time'
import moment from 'moment'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

beforeEach(() => {
  jest.clearAllMocks()
})

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should render blog posts', async () => {
  const withoutPosts = fakeEvent({
    template: fakePanels({
      blogPosts: createEntityList([]),
    }),
  })

  const {queryByLabelText, rerender, getAllByLabelText, findByText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {
      event: withoutPosts,
      actions: emptyActions,
      score: defaultScore,
      withRouter: true,
    },
  )

  expect(queryByLabelText('blog post')).not.toBeInTheDocument()

  const numPosts = faker.random.number({min: 1, max: 5})
  const blogPosts = createEntityList(
    Array.from({length: numPosts}, () =>
      fakeBlogPost({
        publishAt: faker.random.boolean()
          ? faker.date.past().toISOString()
          : faker.date.future().toISOString(),
        isVisible: faker.random.boolean(),
      }),
    ),
  )

  const withPosts = fakeEvent({
    template: fakePanels({
      blogPosts,
    }),
  })

  rerender(<Dashboard isEditMode={false} user={fakeUser()} />, {
    event: withPosts,
  })

  for (const post of Object.values(blogPosts.entities)) {
    if (
      post.isVisible === true &&
      post.publishAt &&
      getDiffDatetime(post.publishAt, now()) < 0
    )
      expect(await findByText(post.title)).toBeInTheDocument()
  }

  const numVisiblePosts = Object.values(blogPosts.entities).filter(
    (i) =>
      i.isVisible && i.publishAt && getDiffDatetime(i.publishAt, now()) < 0,
  ).length

  if (numVisiblePosts > 0) {
    expect(getAllByLabelText('blog post').length).toBe(numVisiblePosts)
  }
})

it('should edit a blog post', async () => {
  const numPosts = faker.random.number({min: 1, max: 5})
  const blogPosts = createEntityList(
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const event = fakeEvent({
    template: fakePanels({blogPosts}),
  })
  const {
    findAllByLabelText,
    findByLabelText,
    findByText,
  } = await goToDashboardConfig({
    event,
  })

  const targetIndex = faker.random.number({min: 0, max: numPosts - 1})

  const post = (await findAllByLabelText('blog post'))[targetIndex]
  clickEdit(post)

  const updatedTitle = faker.random.words(10)
  user.type(await findByLabelText('blog post title'), updatedTitle)

  fireEvent.click(await findByLabelText('save'))

  expect(await findByText(updatedTitle)).toBeInTheDocument()
})

it('should add a new blog post', async () => {
  const numPosts = faker.random.number({min: 1, max: 3})

  const blogPosts = createEntityList(
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const event = fakeEvent({template: fakePanels({blogPosts})})

  const {findAllByLabelText, findByLabelText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByLabelText('add blog post'))

  fireEvent.click(await findByLabelText('save'))

  expect((await findAllByLabelText('blog post')).length).toBe(numPosts + 1)
})

it('should remove a blog post', async () => {
  const numPosts = faker.random.number({min: 2, max: 3})

  const blogPosts = createEntityList(
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const event = fakeEvent({template: fakePanels({blogPosts})})

  const {findAllByLabelText, findByLabelText} = await goToDashboardConfig({
    event,
  })

  const targetIndex = faker.random.number({min: 0, max: numPosts - 1})
  const post = (await findAllByLabelText('blog post'))[targetIndex]
  clickEdit(post)

  fireEvent.click(await findByLabelText('remove blog post'))
  expect((await findAllByLabelText('blog post')).length).toBe(numPosts - 1)
})

it('should show in order', async () => {
  /**
   * Old but recently published
   */

  const firstPost = fakeBlogPost({
    publishAt: moment().subtract(1, 'hour').toISOString(),
    postedAt: moment().subtract(10, 'day').toISOString(),
    isVisible: true,
  })

  const secondPost = fakeBlogPost({
    publishAt: null,
    postedAt: moment().subtract(2, 'day').toISOString(),
    isVisible: true,
  })

  const thirdPost = fakeBlogPost({
    publishAt: null,
    postedAt: moment().subtract(4, 'day').toISOString(),
    isVisible: true,
  })

  const event = fakeEvent({
    template: fakePanels({
      blogPosts: createEntityList([firstPost, secondPost, thirdPost]),
    }),
  })

  const {findAllByLabelText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {
      event,
      actions: emptyActions,
      score: defaultScore,
      withRouter: true,
    },
  )

  await wait(async () => {
    expect((await findAllByLabelText('blog post')).length).toBe(3)
  })

  const titleAtIndex = async (index: number) =>
    (await findAllByLabelText('blog post'))[index].children[0].textContent

  // Everything is in order
  expect(await titleAtIndex(0)).toBe(firstPost.title)
  expect(await titleAtIndex(1)).toBe(secondPost.title)
  expect(await titleAtIndex(2)).toBe(thirdPost.title)
})
