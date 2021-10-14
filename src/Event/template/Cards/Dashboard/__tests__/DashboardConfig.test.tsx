import user from '@testing-library/user-event'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should upload a logo', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')

  const event = fakeEvent({template: fakeCards(), logo: null})
  const {findByLabelText} = await goToDashboardConfig({event})

  clickEdit(await findByLabelText('header'))

  const logo = new File([], 'mylogo.jpg')
  const logoInput = await findByLabelText('logo image input')
  Object.defineProperty(logoInput, 'files', {
    value: [logo],
  })

  const logoData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const withLogo: ObvioEvent = {...event, logo: logoData}
  mockPost.mockImplementationOnce(() => Promise.resolve({data: withLogo}))

  fireEvent.change(logoInput)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.get('logo')).toBe(logo)
})

it('should remove the logo', async () => {
  const logo = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const event = fakeEvent({template: fakeCards(), logo})
  const {findByLabelText} = await goToDashboardConfig({event})

  // has logo url set
  expect(((await findByLabelText('logo')) as HTMLImageElement).src).toMatch(
    logo.url,
  )

  clickEdit(await findByLabelText('header'))

  user.click(await findByLabelText('remove logo image'))

  const withoutLogo: ObvioEvent = {...event, logo: null}
  mockPut.mockImplementationOnce(() => Promise.resolve({data: withoutLogo}))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.logo).toBe(null)
})
