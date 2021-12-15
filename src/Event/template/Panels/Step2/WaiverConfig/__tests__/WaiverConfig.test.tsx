import faker from 'faker'
import axios from 'axios'
import {fakeEvent, fakeWaiver} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {waiverLogoPath} from 'Event/Step2/WaiverProvider'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {goToWaiverConfig} from 'Event/Step2/__utils__/go-to-waiver-config'

const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

beforeAll(() => {
  // Hide JSDOM nav unimplemented error
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

afterEach(() => {
  jest.clearAllMocks()
})

it('should show waiver config', async () => {
  // Patch fetch to automatically return the existing waiver logo blob
  // @ts-ignore
  window.fetch = jest.fn(() =>
    Promise.resolve(() => ({blob: jest.fn(() => [])})),
  )
  const mockedFetch = window.fetch as jest.Mock

  const fakerWaiver = fakeWaiver({
    body: '<p>waiver body</p>',
    title: faker.random.words(3),
    agree_statement: faker.lorem.paragraph(),
    is_enabled: false,
    form: null,
  })

  const event = fakeEvent({
    waiver: fakerWaiver,
    template: fakePanels(),
  })

  const {findByLabelText} = await goToWaiverConfig({
    event: event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  expect(await findByLabelText('waiver title')).toBeInTheDocument()

  if (!event.waiver || !event.waiver.logo) {
    throw new Error(`Missing event waiver logo required for test`)
  }

  await wait(() => {
    expect(mockedFetch).toHaveBeenCalledTimes(1)
  })

  expect(mockedFetch.mock.calls[0][0]).toBe(waiverLogoPath(event.waiver.logo))
})

it('should submit a disabled waiver without filling the required fields', async () => {
  window.URL.createObjectURL = jest.fn()
  const fakerWaiver = fakeWaiver({
    body: '',
    title: faker.random.words(3),
    agree_statement: '',
    signature_prompt: '',
    is_enabled: false,
    logo: '',
    form: null,
  })
  const event = fakeEvent({
    waiver: fakerWaiver,
    template: fakePanels(),
  })
  const {findByLabelText} = await goToWaiverConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const title = faker.random.words(3)
  user.type(await findByLabelText('waiver title'), title)

  const image = new File([], 'logo.jpg')
  const imageInput = await findByLabelText('logo input')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })
  fireEvent.change(imageInput)

  // Set template data
  const buttonText = 'foobar'
  user.type(await findByLabelText('waiver button text'), buttonText)

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {waiver: fakerWaiver}}),
  )
  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const data = mockPost.mock.calls[0][1]

  expect(data.get('title')).toBe(title)
  expect(data.get('logo')).toBe(image)

  // Did save template data
  const [_, templateData] = mockPut.mock.calls[0]
  expect(templateData.template['waiver.buttonText']).toBe(buttonText)
})

it('should not submit a enabled waiver without filling the required fields', async () => {
  const fakerWaiver = fakeWaiver({
    body: '',
    title: faker.random.words(3),
    agree_statement: '',
    signature_prompt: '',
    is_enabled: true,
    logo: '',
    form: null,
  })
  const event = fakeEvent({
    waiver: fakerWaiver,
    template: fakePanels(),
  })
  const {findByLabelText} = await goToWaiverConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const title = faker.random.words(3)
  user.type(await findByLabelText('waiver title'), title)

  const agreeStatement = faker.lorem.paragraph()
  user.type(await findByLabelText('waiver agree statement'), agreeStatement)

  // Set template data
  const buttonText = 'foobar'
  user.type(await findByLabelText('waiver button text'), buttonText)

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPut).toHaveBeenCalledTimes(0)
  })
})
