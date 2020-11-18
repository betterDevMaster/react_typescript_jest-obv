import React from 'react'
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

it('should show the welcome text', async () => {
  const dashboard = fakeSimpleBlog()
  const {findByText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )
  expect(await findByText(dashboard.welcomeText)).toBeInTheDocument()
})

it('should update the text value', async () => {
  const text = faker.random.words(3)
  const dashboard = fakeSimpleBlog({welcomeText: text})
  const event = fakeEvent()

  const {findByLabelText} = render(
    <StaticEventProvider event={event}>
      <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />
    </StaticEventProvider>,
  )

  expect((await findByLabelText('welcome')).textContent).toBe(text)

  clickEdit(await findByLabelText('welcome'))
  const newVal = faker.random.word()

  fireEvent.change(await findByLabelText('edit welcome text'), {
    target: {
      value: newVal,
    },
  })
  fireEvent.click(await findByLabelText('close config dialog'))

  expect((await findByLabelText('welcome')).textContent).toBe(newVal)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.dashboard.welcomeText).toBe(newVal)
})
