import faker from 'faker'
import {fakeEvent, fakeSponsor} from 'Event/__utils__/factory'
import axios from 'axios'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToSponsorConfig} from 'Event/template/FiftyBlog/Dashboard/Sponsors/SponsorPageConfig/__utils__/go-to-sponsor-page-config'

const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should set sponsor page settings', async () => {
  window.URL.createObjectURL = jest.fn()
  const sponsors = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    () => fakeSponsor({image: null}),
  )

  const event = fakeEvent({
    sponsor_question_icon: {
      url: 'http://s3.com/existingicon.png',
      name: 'existingicon.png',
    },
  })
  const {findByText, findByLabelText} = await goToSponsorConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
    sponsors,
  })

  for (const sponsor of sponsors) {
    expect(await findByText(sponsor.name)).toBeInTheDocument()
  }

  const title = faker.random.words(3)

  fireEvent.click(await findByLabelText('configure sponsor page'))

  // fireEvent.change(await findByLabelText('sponsor page title'), {
  //   target: {
  //     value: title,
  //   },
  // })

  // Remove existing icon...
  fireEvent.click(await findByLabelText('remove sponsor question icon'))

  const image = new File([], 'image.jpg')
  const imageInput = await findByLabelText('question icon input')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })
  fireEvent.change(imageInput)

  const url = faker.internet.url()

  const updated: ObvioEvent = {
    ...event,
    sponsor_page_title: title,
    sponsor_question_icon: {
      url,
      name: 'icon.png',
    },
  }

  mockPost.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [postUrl, postData] = mockPost.mock.calls[0]

  expect(postUrl).toMatch(`/events/${event.slug}`)
  expect(postData.get('sponsor_page_title')).toBe(title)
  expect(postData.get('sponsor_question_icon')).toBe(image)

  fireEvent.click(await findByLabelText('configure sponsor page'))
  fireEvent.click(await findByLabelText('remove sponsor question icon'))

  user.click(await findByLabelText('save'))

  const withoutIcon: ObvioEvent = {
    ...updated,
    sponsor_question_icon: null,
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: withoutIcon}))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(3)
  })

  const [_, putData] = mockPut.mock.calls[2]

  // Sent request to remove image
  expect(putData.sponsor_question_icon).toBe(null)
})

it('should add a sponsor', async () => {
  const numSponsors = faker.random.number({min: 2, max: 5})

  const sponsors = Array.from({length: numSponsors}, () =>
    fakeSponsor({image: null}),
  )

  const event = fakeEvent()
  const {findByText, findByLabelText} = await goToSponsorConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
    sponsors,
  })

  for (const sponsor of sponsors) {
    expect(await findByText(sponsor.name)).toBeInTheDocument()
  }

  const newSponsor = fakeSponsor()

  mockPost.mockImplementationOnce(() => Promise.resolve({data: newSponsor}))

  user.click(await findByLabelText('add sponsor'))
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  user.click(await findByLabelText('close dialog'))

  expect(await findByText(newSponsor.name)).toBeInTheDocument()
})
