import faker from 'faker'
import {fakeEvent, fakeSponsor} from 'Event/__utils__/factory'
import axios from 'axios'
import user from '@testing-library/user-event'
import {findByText, fireEvent, wait} from '@testing-library/react'
import {ObvioEvent, Sponsor} from 'Event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToSponsorConfig} from 'organization/Event/SponsorPageConfig/__utils__/go-to-sponsor-page-config'

const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should upload an image', async () => {
  // Patch fetch to automatically return the existing waiver logo blob
  // @ts-ignore
  window.fetch = jest.fn(() =>
    Promise.resolve(() => ({blob: jest.fn(() => [])})),
  )
  window.URL.createObjectURL = jest.fn()

  // start with no image
  const sponsor = fakeSponsor({image: null})

  const event = fakeEvent()
  const {findByLabelText, findByText} = await goToSponsorConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
    sponsors: [sponsor],
  })

  user.click(await findByLabelText('sponsor placeholder image'))

  const imageData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }

  const imageInput = await findByLabelText('sponsor image input')

  const withImage: Sponsor = {...sponsor, image: imageData}

  const image = new File([], 'sponsor_image.png')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })
  fireEvent.change(imageInput)

  mockPost.mockImplementationOnce(() => Promise.resolve({data: withImage}))

  user.click(await findByLabelText('save sponsor'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/sponsors/${sponsor.id}`)
  expect(data.get('image')).toBe(image)

  expect((await findByLabelText('sponsor image')).getAttribute('src')).toBe(
    imageData.url,
  )
})

it('should remove an image', async () => {
  // Patch fetch to automatically return the existing waiver logo blob
  // @ts-ignore
  window.fetch = jest.fn(() =>
    Promise.resolve({blob: () => Promise.resolve([])}),
  )

  window.URL.createObjectURL = jest.fn()

  const imageData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }

  const sponsor = fakeSponsor({image: imageData})

  const event = fakeEvent()
  const {findByLabelText, findByText} = await goToSponsorConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
    sponsors: [sponsor],
  })

  expect((await findByLabelText('sponsor image')).getAttribute('src')).toBe(
    imageData.url,
  )

  user.click(await findByLabelText('sponsor image'))
  user.click(await findByText('clear'))

  const withOutImage = {
    ...sponsor,
    image: null,
  }
  mockPut.mockImplementationOnce(() => Promise.resolve({data: withOutImage}))

  user.click(await findByLabelText('save sponsor'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(await findByLabelText('sponsor placeholder image')).toBeInTheDocument()
})
