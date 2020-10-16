import React from 'react'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import Dashboard from 'Dashboard'
import {render} from '__utils__/render'
import {fakeResource} from 'Dashboard/components/ResourceList/__utils__/factory'
import {fakeNavButton} from 'Dashboard/components/NavButton/__utils__/factory'
import {fakeBlogPost} from 'Dashboard/components/BlogPost/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import userEvent from '@testing-library/user-event'

it('should update the logo', async () => {
  const dashboard = fakeSimpleBlog()
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(((await findByLabelText('logo')) as HTMLImageElement).src).toBe(
    dashboard.logo,
  )

  clickEdit(await findByLabelText('header'))

  const newUrl = faker.internet.url()
  userEvent.type(await findByLabelText('edit logo'), newUrl)

  fireEvent.click(await findByLabelText('close config dialog'))

  expect(((await findByLabelText('logo')) as HTMLImageElement).src).toBe(
    `${newUrl}/`,
  )
})

it('should show the user email', async () => {
  const user = fakeUser()
  const {findByText, findByTestId} = render(
    <Dashboard isEditMode={false} dashboard={fakeSimpleBlog()} user={user} />,
  )

  const menuButton = await findByTestId('menu-button')
  fireEvent.click(menuButton)
  expect(await findByText(new RegExp(user.email))).toBeInTheDocument()
})

it('should render resources', async () => {
  const dashboard = fakeSimpleBlog({
    resourceList: {
      description: '',
      resources: [],
    },
  })

  const {queryByText, rerender, findAllByLabelText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByText(/resources:/i)).not.toBeInTheDocument()

  const numResources = faker.random.number({min: 1, max: 6})
  const withResources = fakeSimpleBlog({
    resourceList: {
      description: '',
      resources: Array.from({length: numResources}, fakeResource),
    },
  })

  rerender(
    <Dashboard
      isEditMode={false}
      dashboard={withResources}
      user={fakeUser()}
    />,
  )

  const resources = await findAllByLabelText('event resource')
  expect(resources.length).toBe(numResources)
})

it('should render a footer', () => {
  const dashboard = fakeSimpleBlog({
    footerBackground: '#000000',
    footerTextColor: '#FFFFFF',
    footerTermsLink: null,
    footerPrivacyLink: null,
    footerCopyrightText: null,
  })

  const {queryByLabelText, rerender, getByText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByLabelText(/terms of service/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/privacy policy/i)).not.toBeInTheDocument()

  const copyrightText = faker.lorem.sentence()

  const withFooter = fakeSimpleBlog({
    footerBackground: '#000000',
    footerTextColor: '#FFFFFF',
    footerTermsLink: faker.internet.url(),
    footerPrivacyLink: faker.internet.url(),
    footerCopyrightText: copyrightText,
  })

  rerender(
    <Dashboard isEditMode={false} dashboard={withFooter} user={fakeUser()} />,
  )

  expect(queryByLabelText(/terms of service/i)).toBeInTheDocument()
  expect(queryByLabelText(/privacy policy/i)).toBeInTheDocument()

  expect(getByText(new RegExp(copyrightText))).toBeInTheDocument()
})

it('should render blog posts', () => {
  const withoutPosts = fakeSimpleBlog({
    blogPosts: createEntityList([]),
  })

  const {queryByLabelText, rerender, getAllByLabelText, getByText} = render(
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
