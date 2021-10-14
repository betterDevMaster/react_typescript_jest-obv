import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeBlogPost} from 'Event/Dashboard/components/BlogPost/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent, wait} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
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

it('should edit a blog post', async () => {
  const numPosts = faker.random.number({min: 1, max: 5})
  const blogPosts = createEntityList(
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const event = fakeEvent({
    template: fakeCards({blogPosts}),
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

  const event = fakeEvent({template: fakeCards({blogPosts})})

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

  const event = fakeEvent({template: fakeCards({blogPosts})})

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
    template: fakeCards({
      blogPosts: createEntityList([firstPost, secondPost, thirdPost]),
    }),
  })

  const {findAllByLabelText} = await goToDashboardConfig({
    event,
  })

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
