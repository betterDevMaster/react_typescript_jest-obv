import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {fakeBlogPost} from 'Event/Dashboard/components/BlogPost/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {emptyActions, render} from '__utils__/render'
import {fakeEvent} from 'Event/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider/__utils__/StaticPointsProvider'
import {getDiffDatetime, now} from 'lib/date-time'

it('should render blog posts', async () => {
  const withoutPosts = fakeEvent({
    template: fakeSimpleBlog({
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
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const withPosts = fakeEvent({
    template: fakeSimpleBlog({
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
    template: fakeSimpleBlog({blogPosts}),
  })

  const {findAllByLabelText, findByLabelText, findByText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {event, actions: emptyActions, score: defaultScore, withRouter: true},
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

  const event = fakeEvent({template: fakeSimpleBlog({blogPosts})})

  const {findAllByLabelText, findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {event, actions: emptyActions, score: defaultScore, withRouter: true},
  )

  fireEvent.click(await findByLabelText('add blog post'))
  expect((await findAllByLabelText('blog post')).length).toBe(numPosts + 1)
})

it('should remove a blog post', async () => {
  const numPosts = faker.random.number({min: 2, max: 3})

  const blogPosts = createEntityList(
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const event = fakeEvent({template: fakeSimpleBlog({blogPosts})})

  const {findAllByLabelText, findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {event, actions: emptyActions, score: defaultScore, withRouter: true},
  )

  const targetIndex = faker.random.number({min: 0, max: numPosts - 1})
  const post = (await findAllByLabelText('blog post'))[targetIndex]
  clickEdit(post)

  fireEvent.click(await findByLabelText('remove blog post'))
  expect((await findAllByLabelText('blog post')).length).toBe(numPosts - 1)
})
