import React from 'react'
import user from '@testing-library/user-event'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render} from '__utils__/render'
import {fakeEvent} from 'Event/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {ObvioEvent} from 'Event'

afterEach(() => {
  jest.clearAllMocks()
})

const mockPost = axios.post as jest.Mock

it('should upload a welcome image', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')
  const event = fakeEvent({template: fakeSimpleBlog(), header_background: null})
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      score: defaultScore,
      actions: [],
      organization: fakeOrganization(),
    },
  )

  user.click(await findByLabelText('edit hero'))

  const image = new File([], 'dashboard_welcome.jpg')
  const imageInput = await findByLabelText('welcome_image image input')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })

  const imageData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const withWelcomeImage: ObvioEvent = {...event, logo: imageData}
  mockPost.mockImplementationOnce(() => Promise.resolve(withWelcomeImage))

  fireEvent.change(imageInput)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.get('welcome_image')).toBe(image)
})
