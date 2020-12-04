import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {fakeBlogPost} from 'Event/Dashboard/components/BlogPost/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {renderWithEvent} from '__utils__/render'

it('should render blog posts', () => {
  const withoutPosts = fakeSimpleBlog({
    blogPosts: createEntityList([]),
  })

  const {
    queryByLabelText,
    rerender,
    getAllByLabelText,
    getByText,
  } = renderWithEvent(
    <Dashboard isEditMode={false} dashboard={withoutPosts} user={fakeUser()} />,
  )

  expect(queryByLabelText('blog post')).not.toBeInTheDocument()

  const numPosts = faker.random.number({min: 1, max: 5})
  const blogPosts = createEntityList(
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const withPosts = fakeSimpleBlog({
    blogPosts,
  })

  rerender(
    <Dashboard isEditMode={false} dashboard={withPosts} user={fakeUser()} />,
  )

  expect(getAllByLabelText('blog post').length).toBe(numPosts)

  for (const post of Object.values(blogPosts.entities)) {
    expect(getByText(post.title)).toBeInTheDocument()
  }
})

it('should edit a blog post', async () => {
  const numPosts = faker.random.number({min: 1, max: 5})
  const blogPosts = createEntityList(
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const dashboard = fakeSimpleBlog({
    blogPosts,
  })

  const {findAllByLabelText, findByLabelText, findByText} = renderWithEvent(
    <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />,
  )

  const targetIndex = faker.random.number({min: 0, max: numPosts - 1})

  const post = (await findAllByLabelText('blog post'))[targetIndex]
  clickEdit(post)

  const updatedTitle = faker.random.words(10)
  user.type(await findByLabelText('blog post title'), updatedTitle)

  fireEvent.click(await findByLabelText('close config dialog'))

  expect(await findByText(updatedTitle)).toBeInTheDocument()
})

it('should add a new blog post', async () => {
  const numPosts = faker.random.number({min: 1, max: 3})

  const blogPosts = createEntityList(
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const dashboard = fakeSimpleBlog({blogPosts})

  const {findAllByLabelText, findByLabelText} = renderWithEvent(
    <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />,
  )

  fireEvent.click(await findByLabelText('add blog post'))
  expect((await findAllByLabelText('blog post')).length).toBe(numPosts + 1)
})

it('should remove a blog post', async () => {
  const numPosts = faker.random.number({min: 2, max: 3})

  const blogPosts = createEntityList(
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const dashboard = fakeSimpleBlog({blogPosts})

  const {findAllByLabelText, findByLabelText} = renderWithEvent(
    <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />,
  )

  const targetIndex = faker.random.number({min: 0, max: numPosts - 1})
  const post = (await findAllByLabelText('blog post'))[targetIndex]
  clickEdit(post)

  fireEvent.click(await findByLabelText('remove blog post'))
  expect((await findAllByLabelText('blog post')).length).toBe(numPosts - 1)
})
