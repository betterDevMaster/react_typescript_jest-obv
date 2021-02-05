import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider/__utils__/StaticPointsProvider'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {ObvioEvent} from 'Event'

const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should upload a logo', async () => {
  const event = fakeEvent({template: fakeSimpleBlog(), logo: null})
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      score: defaultScore,
      actions: emptyActions,
      organization: fakeOrganization(),
    },
  )

  clickEdit(await findByLabelText('header'))

  const logo = new File([], 'mylogo.jpg')
  const logoInput = await findByLabelText('logo image input')
  Object.defineProperty(logoInput, 'files', {
    value: [logo],
  })

  const logoData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const withLogo: ObvioEvent = {...event, logo: logoData}
  mockPost.mockImplementationOnce(() => Promise.resolve(withLogo))

  fireEvent.change(logoInput)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.get('logo')).toBe(logo)
})

it('should remove the logo', async () => {
  const logo = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const event = fakeEvent({template: fakeSimpleBlog(), logo})
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      score: defaultScore,
      actions: emptyActions,
      organization: fakeOrganization(),
    },
  )

  // has logo url set
  expect(((await findByLabelText('logo')) as HTMLImageElement).src).toMatch(
    logo.url,
  )

  clickEdit(await findByLabelText('header'))

  user.click(await findByLabelText('remove logo image'))

  const withoutLogo: ObvioEvent = {...event, logo: null}
  mockPut.mockImplementationOnce(() => Promise.resolve(withoutLogo))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.logo).toBe(null)
})

it('should show the user email', async () => {
  const attendee = fakeAttendee({
    tech_check_completed_at: 'now',
    waiver: 'some_waiver.png',
  })

  const {findByText, findByLabelText} = await loginToEventSite({
    attendee,
  })

  user.click(await findByLabelText('show side menu'))
  expect(await findByText(new RegExp(attendee.email))).toBeInTheDocument()
})

it('it should send points for visiting dashboard', async () => {
  const action = fakeAction({
    id: 3, // Dashboard has id of 3
    is_platform_action: true,
    description: 'dashboard action',
  })

  const platformActions = [action]

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  const {event, findByText} = await loginToEventSite({
    platformActions,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  const [url] = mockPost.mock.calls[1]
  expect(url).toMatch(`/events/${event.slug}/actions/3`) // Fired dashboard ID

  // show points pop-up
  expect(await findByText(new RegExp(action.description))).toBeInTheDocument()
})

it('should upload a header background', async () => {
  const event = fakeEvent({template: fakeSimpleBlog(), header_background: null})
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      score: defaultScore,
      actions: emptyActions,
      organization: fakeOrganization(),
    },
  )

  clickEdit(await findByLabelText('header'))

  const headerBg = new File([], 'header_bg.jpg')
  const headerBgInput = await findByLabelText('header_background image input')
  Object.defineProperty(headerBgInput, 'files', {
    value: [headerBg],
  })

  const headerData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const withHeaderBg: ObvioEvent = {...event, logo: headerData}
  mockPost.mockImplementationOnce(() => Promise.resolve(withHeaderBg))

  fireEvent.change(headerBgInput)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.get('header_background')).toBe(headerBg)
})

it('should remove the header background', async () => {
  const headerBg = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const event = fakeEvent({
    template: fakeSimpleBlog(),
    header_background: headerBg,
  })
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      score: defaultScore,
      actions: emptyActions,
      organization: fakeOrganization(),
    },
  )

  clickEdit(await findByLabelText('header'))

  user.click(await findByLabelText('remove header_background image'))

  const withoutHeaderBg: ObvioEvent = {...event, header_background: null}
  mockPut.mockImplementationOnce(() => Promise.resolve(withoutHeaderBg))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.header_background).toBe(null)
})
