import faker from 'faker'
import axios from 'axios'
import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import {waiverLogoPath} from 'Event/Step2/WaiverProvider'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPost = axios.post as jest.Mock

beforeAll(() => {
  // Hide JSDOM nav unimplemented error
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  jest.clearAllMocks()
  // @ts-ignore
  console.error.mockRestore()
})

it('should show waiver config', async () => {
  // Patch fetch to automatically return the existing waiver logo blob
  // @ts-ignore
  window.fetch = jest.fn(() =>
    Promise.resolve(() => ({blob: jest.fn(() => [])})),
  )
  const mockedFetch = window.fetch as jest.Mock

  const {findByLabelText, event} = await goToWaiverConfig({
    userPermissions: [CONFIGURE_EVENTS],
  })
  expect(await findByLabelText('waiver body')).toBeInTheDocument()

  if (!event.waiver || !event.waiver.logo) {
    throw new Error(`Missing event waiver logo required for test`)
  }

  await wait(() => {
    expect(mockedFetch).toHaveBeenCalledTimes(1)
  })

  expect(mockedFetch.mock.calls[0][0]).toBe(waiverLogoPath(event.waiver.logo))
})

it('should submit a waiver', async () => {
  window.URL.createObjectURL = jest.fn()
  const fakerWaiver = {
    body: '<p>fake body</p>',
    title: faker.random.words(3),
    agree_statement: faker.lorem.paragraph(),
    is_enabled: false,
    logo: '',
    form: null,
  }
  const event = fakeEvent({waiver: fakerWaiver})
  const {findByLabelText} = await goToWaiverConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const title = faker.random.words(3)
  user.type(await findByLabelText('waiver title'), title)

  // Manually set body input because we can't type into CKEditor
  const body = faker.lorem.paragraph()

  const agreeStatement = faker.lorem.paragraph()
  user.type(await findByLabelText('waiver agree statement'), agreeStatement)

  const bodyEl = (await findByLabelText('waiver body')) as HTMLInputElement
  bodyEl.value = body

  const image = new File([], 'logo.jpg')
  const imageInput = await findByLabelText('logo input')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })
  fireEvent.change(imageInput)

  user.click(await findByLabelText('save waiver'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const data = mockPost.mock.calls[0][1]

  expect(data.get('title')).toBe(title)
  expect(data.get('body')).toBe(`<p>${body}</p>`) // CKEditor automatically converts to HTML
  expect(data.get('logo')).toBe(image)
})

async function goToWaiverConfig(overrides: EventOverrides = {}) {
  const context = await goToEventConfig(overrides)

  user.click(await context.findByLabelText('configure waiver'))

  return context
}
