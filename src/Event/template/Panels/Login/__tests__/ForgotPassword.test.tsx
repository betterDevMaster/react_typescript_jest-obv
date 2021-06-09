import {act, wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import App from 'App'
import axios from 'axios'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {visitEventSite} from 'Event/__utils__/url'
import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show event forgot password form', async () => {
  const event = visitEventSite({
    event: fakeEvent({
      template: fakePanels(),
    }),
  })
  const email = faker.internet.email()

  const {findByLabelText} = render(<App />)

  await wait(() => {
    expect(mockGet).toBeCalledTimes(1)
  })

  expect(await findByLabelText(`email`)).toBeInTheDocument()
  expect(await findByLabelText(`password`)).toBeInTheDocument()
  expect(await findByLabelText(`forgot password`)).toBeInTheDocument()

  await act(async () => {
    user.click(await findByLabelText('forgot password'))
  })

  user.type(await findByLabelText('event account email'), email)
  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))
  await act(async () => {
    user.click(await findByLabelText('submit reset password'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  const url = mockPost.mock.calls[0][0]

  expect(url).toMatch(`/events/${event.slug}/forgot_password`)
})
