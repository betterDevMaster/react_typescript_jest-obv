import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import {goToGeneralConfig} from 'organization/Event/GeneralConfig/__utils__/go-to-general-config'
import {wait} from '@testing-library/react'
import {fireEvent} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import mockAxios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPost = mockAxios.post as jest.Mock
const mockPut = mockAxios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update a background', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')

  const event = fakeEvent({
    login_background: null,
  })

  const {findByLabelText} = await goToGeneralConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const background = new File([], 'background.jpg')
  const input = await findByLabelText('login_background image input')

  Object.defineProperty(input, 'files', {
    value: [background],
  })

  const backgroundData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const withBackground: ObvioEvent = {
    ...event,
    login_background: backgroundData,
  }

  mockPost.mockImplementationOnce(() => Promise.resolve({data: withBackground}))

  fireEvent.change(input)

  user.click(await findByLabelText('cancel image resize'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.get('login_background')).toBe(background)

  user.click(await findByLabelText('remove login_background image'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [removeUrl, removeData] = mockPut.mock.calls[0]

  expect(removeUrl).toMatch(`/events/${event.slug}`)
  expect(removeData.login_background).toBe(null)
})

it('should update a logo', async () => {
  const event = fakeEvent({
    login_background: null,
  })

  const {findByLabelText} = await goToGeneralConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const logo = new File([], 'logo.jpg')
  const input = await findByLabelText('login_logo image input')

  Object.defineProperty(input, 'files', {
    value: [logo],
  })

  const logoData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const withLogo: ObvioEvent = {
    ...event,
    login_logo: logoData,
  }

  mockPost.mockImplementationOnce(() => Promise.resolve({data: withLogo}))

  fireEvent.change(input)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.get('login_logo')).toBe(logo)

  user.click(await findByLabelText('remove login_logo image'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [removeUrl, removeData] = mockPut.mock.calls[0]

  expect(removeUrl).toMatch(`/events/${event.slug}`)
  expect(removeData.login_logo).toBe(null)
})
