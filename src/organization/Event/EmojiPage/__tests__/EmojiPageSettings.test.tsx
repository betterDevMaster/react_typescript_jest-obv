import {goToEventConfig} from 'organization/Event/__utils__/event'
import user from '@testing-library/user-event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import faker from 'faker'
import {wait} from '@testing-library/dom'
import axios from 'axios'
import {ObvioEvent} from 'Event'
import {fireEvent} from '@testing-library/react'

const mockPut = axios.put as jest.Mock
const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should update emoji page background image', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')

  const {findByLabelText, event} = await goToEventConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('configure emoji page'))

  const background = new File([], 'background.jpg')
  const input = await findByLabelText('emoji_page_background image input')

  Object.defineProperty(input, 'files', {
    value: [background],
  })

  const backgroundData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const withBackground: ObvioEvent = {
    ...event,
    emoji_page_background: backgroundData,
  }

  mockPost.mockImplementationOnce(() => Promise.resolve({data: withBackground}))

  fireEvent.change(input)

  user.click(await findByLabelText('cancel image resize'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.get('emoji_page_background')).toBe(background)

  mockPut.mockImplementationOnce(() => Promise.resolve({event}))

  user.click(await findByLabelText('remove emoji_page_background image'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [removeUrl, removeData] = mockPut.mock.calls[0]

  expect(removeUrl).toMatch(`/events/${event.slug}`)
  expect(removeData.emoji_page_background).toBe(null)
})

it('should toggle visible emoji page background image', async () => {
  const {findByLabelText, event} = await goToEventConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('configure emoji page'))

  user.click(await findByLabelText('toggle background visible'))
  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['emojiPage.backgroundHidden']).toBe(true)
})

it('should set emoji page background color', async () => {
  const {findByLabelText, event} = await goToEventConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('configure emoji page'))

  const color = faker.commerce.color()
  user.type(await findByLabelText('emoji page background color'), color)
  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['emojiPage.backgroundColor']).toBe(color)
})
