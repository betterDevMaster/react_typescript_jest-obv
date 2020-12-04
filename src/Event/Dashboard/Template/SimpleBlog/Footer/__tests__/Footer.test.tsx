import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render} from '__utils__/render'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import StaticEventProvider from 'Event/__utils__/StaticEventProvider'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
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
  const event = fakeEvent()

  const {findByLabelText} = render(
    <StaticEventProvider event={event}>
      <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />
    </StaticEventProvider>,
  )

  clickEdit(await findByLabelText('footer'))

  user.type(await findByLabelText('set copyright text'), copyrightText)

  fireEvent.click(await findByLabelText('close config dialog'))

  expect((await findByLabelText('copyright')).textContent).toBe(copyrightText)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.dashboard.footer.copyrightText).toBe(copyrightText)
})
