import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'organization/user/event/Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'organization/user/event/Dashboard'
import {render} from '__utils__/render'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'

beforeAll(() => {
  jest.setTimeout(10000)
})

afterAll(() => {
  jest.setTimeout(5000)
})

it('should render a footer', () => {
  const dashboard = fakeSimpleBlog({
    footer: {
      background: '#000000',
      textColor: '#FFFFFF',
      termsLink: null,
      privacyLink: null,
      copyrightText: null,
    },
  })

  const {queryByLabelText, rerender, getByText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByLabelText(/terms of service/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/privacy policy/i)).not.toBeInTheDocument()

  const copyrightText = faker.lorem.sentence()

  const withFooter = fakeSimpleBlog({
    footer: {
      background: '#000000',
      textColor: '#FFFFFF',
      termsLink: faker.internet.url(),
      privacyLink: faker.internet.url(),
      copyrightText: copyrightText,
    },
  })

  rerender(
    <Dashboard isEditMode={false} dashboard={withFooter} user={fakeUser()} />,
  )

  expect(queryByLabelText(/terms of service/i)).toBeInTheDocument()
  expect(queryByLabelText(/privacy policy/i)).toBeInTheDocument()

  expect(getByText(new RegExp(copyrightText))).toBeInTheDocument()
})

it('should configure the footer', async () => {
  const dashboard = fakeSimpleBlog({
    footer: {
      background: '#000000',
      textColor: '#FFFFFF',
      termsLink: null,
      privacyLink: null,
      copyrightText: null,
    },
  })

  const copyrightText = faker.lorem.paragraph()

  const {findByLabelText} = render(
    <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />,
  )

  clickEdit(await findByLabelText('footer'))

  user.type(await findByLabelText('set copyright text'), copyrightText)

  fireEvent.click(await findByLabelText('close config dialog'))

  expect((await findByLabelText('copyright')).textContent).toBe(copyrightText)
})
