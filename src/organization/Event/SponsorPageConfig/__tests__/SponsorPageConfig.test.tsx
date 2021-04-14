import faker from 'faker'
import {fakeEvent, fakeSponsor} from 'Event/__utils__/factory'
import axios from 'axios'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToSponsorConfig} from 'organization/Event/SponsorPageConfig/__utils__/go-to-sponsor-page-config'

const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should edit the page title', async () => {
  const sponsors = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    () => fakeSponsor({image: null}),
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

  const title = faker.random.words(3)

  fireEvent.change(await findByLabelText('sponsor page title'), {
    target: {
      value: title,
    },
  })

  const updated: ObvioEvent = {
    ...event,
    sponsor_page_title: title,
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('save sponsor page title'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.sponsor_page_title).toBe(title)
})

it('should upload an image', async () => {
  const sponsors = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    () => fakeSponsor({image: null}),
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

  const iconData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const withIcon: ObvioEvent = {...event, sponsor_question_icon: iconData}
  mockPost.mockImplementationOnce(() => Promise.resolve({data: withIcon}))

  const icon = new File([], 'question_icon.png')
  const iconInput = await findByLabelText('question icon input')
  Object.defineProperty(iconInput, 'files', {
    value: [icon],
  })
  fireEvent.change(iconInput)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [uploadUrl, uploadData] = mockPost.mock.calls[0]

  expect(uploadUrl).toMatch(`/events/${event.slug}`)
  expect(uploadData.get('sponsor_question_icon')).toBe(icon)

  const iconRemoved = {
    ...event,
    sponsor_question_icon: null,
  }

  mockPut.mockImplementationOnce(() => Promise.resolve(iconRemoved))

  user.click(await findByLabelText('remove sponsor question icon'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [removeUrl, removeData] = mockPut.mock.calls[0]

  expect(removeUrl).toMatch(`/events/${event.slug}`)
  expect(removeData.sponsor_question_icon).toBe(null)
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
