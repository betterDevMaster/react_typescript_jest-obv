import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeBackground, fakeEvent} from 'Event/__utils__/factory'
import {goToBackgrounds} from 'organization/Event/Backgrounds/__utils__/go-to-backgrounds-config'
import faker from 'faker'
import {wait} from '@testing-library/dom'
import {fireEvent} from '@testing-library/react'

jest.mock('lib/image')

const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show template select', async () => {
  const event = fakeEvent({template: null})
  const {findByLabelText} = await goToBackgrounds({
    event,
  })
  expect(await findByLabelText('template select')).toBeInTheDocument()
})

it('should configure backgrounds template', async () => {
  const {findByLabelText, event} = await goToBackgrounds()

  /**
   * Update template settings
   */

  const borderColor = faker.internet.color()

  user.type(await findByLabelText('border color'), borderColor)

  mockPut.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        template: {
          'zoomBackgrounds.borderColor': borderColor,
        },
      },
    }),
  )

  user.click(await findByLabelText('create zoom backgrounds page'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [updateImageUrl, updateImageData] = mockPut.mock.calls[0]

  expect(updateImageUrl).toMatch(`/events/${event.slug}/template`)
  expect(updateImageData.template['zoomBackgrounds.borderColor']).toBe(
    borderColor,
  )
})

it('should configure backgrounds page settings', async () => {
  const {findByLabelText, event} = await goToBackgrounds()
  /**
   * Updates page settings
   */

  user.click(await findByLabelText('configure zoom background'))

  const title = faker.random.word()
  user.type(await findByLabelText('page title'), title)

  mockPut.mockImplementationOnce(() => Promise.resolve({data: event}))

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(2)
  })

  const [pageSettingsUrl, pageSettingsData] = mockPut.mock.calls[1]
  expect(pageSettingsUrl).toMatch(`/events/${event.slug}`)

  expect(pageSettingsData.zoom_backgrounds_title).toBe(title)
})

it('should upload a background', async () => {
  const {findByLabelText} = await goToBackgrounds()
  /**
   * Uploads background
   */

  const image = new File(['somebytes'], 'background.jpg', {
    type: 'image/png',
  })
  const imageInput = await findByLabelText('background image input')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })

  const background = fakeBackground()
  mockPost.mockImplementation(() =>
    Promise.resolve({
      data: background,
    }),
  )

  fireEvent.change(imageInput)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  expect((await findByLabelText('background image')).getAttribute('src')).toBe(
    background.image.url,
  )
})
