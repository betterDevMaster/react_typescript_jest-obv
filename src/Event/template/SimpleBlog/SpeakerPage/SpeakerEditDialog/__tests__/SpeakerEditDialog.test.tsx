import faker from 'faker'
import {fakeEvent, fakeSpeaker} from 'Event/__utils__/factory'
import {goToSpeakerConfig} from 'organization/Event/SpeakerPageConfig/__utils__/go-to-speaker-config'
import axios from 'axios'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {Speaker} from 'Event/SpeakerPage'

const mockPost = axios.post as jest.Mock
const mockDelete = axios.delete as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should edit a speaker', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')
  const speakers = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    () => fakeSpeaker({image: null}),
  )

  const event = fakeEvent({speakers})
  const {
    findAllByLabelText,
    findByText,
    findByLabelText,
  } = await goToSpeakerConfig({event, userPermissions: [CONFIGURE_EVENTS]})

  const targetIndex = faker.random.number({min: 0, max: speakers.length - 1})

  user.click((await findAllByLabelText('speaker'))[targetIndex])

  const name = faker.name.firstName()
  user.type(await findByLabelText('speaker name'), name)

  const image = new File([], 'image.jpg')
  const imageInput = await findByLabelText('speaker image input')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })
  fireEvent.change(imageInput)

  user.click(await findByLabelText('cancel image resize'))

  const target = speakers[targetIndex]

  const url = faker.internet.url()
  const updated: Speaker = {
    ...target,
    name,
    text: 'sometext',
    image: {
      url,
      name: 'image.jpeg',
    },
  }

  mockPost.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('save speaker'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  // Check fields were updated
  expect(await findByText(name)).toBeInTheDocument()

  // Updated image
  const numPlaceholderImages = speakers.length - 1
  expect((await findAllByLabelText('speaker placeholder image')).length).toBe(
    numPlaceholderImages,
  )

  expect(
    ((await findByLabelText('speaker image')) as HTMLImageElement).getAttribute(
      'src',
    ),
  ).toBe(url)
})

it('remove a speaker', async () => {
  const speakers = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    () => fakeSpeaker({image: null}),
  )

  const event = fakeEvent({speakers})
  const {
    findAllByLabelText,
    queryByText,
    findByLabelText,
  } = await goToSpeakerConfig({event, userPermissions: [CONFIGURE_EVENTS]})

  const targetIndex = faker.random.number({min: 0, max: speakers.length - 1})
  const target = speakers[targetIndex]
  user.click((await findAllByLabelText('speaker'))[targetIndex])

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('remove speaker'))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  const oneLess = speakers.length - 1
  expect((await findAllByLabelText('speaker')).length).toBe(oneLess)

  expect(queryByText(target.name)).not.toBeInTheDocument()
})
