import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import faker from 'faker'
import {wait} from '@testing-library/react'
import {fireEvent} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import mockAxios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToLoginPageConfig} from 'organization/Event/Page/__utils__/go-to-login-page-config'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'

const mockPost = mockAxios.post as jest.Mock
const mockPut = mockAxios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update a logo', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')

  const event = fakeEvent({
    login_background: null,
    template: fakeCards(),
  })

  const {findByLabelText} = await goToLoginPageConfig({
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
