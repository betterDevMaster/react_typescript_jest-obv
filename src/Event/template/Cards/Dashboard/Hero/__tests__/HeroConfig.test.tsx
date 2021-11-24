import user from '@testing-library/user-event'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

afterEach(() => {
  jest.clearAllMocks()
})

const mockPut = axios.put as jest.Mock

it('should upload a welcome image', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')
  const event = fakeEvent({template: fakeCards(), header_background: null})
  const {findByLabelText} = await goToDashboardConfig({event})

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
  mockPut.mockImplementationOnce(() =>
    Promise.resolve({data: withWelcomeImage}),
  )

  fireEvent.change(imageInput)

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
})
