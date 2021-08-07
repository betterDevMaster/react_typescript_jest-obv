import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fireEvent, wait} from '@testing-library/dom'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {ObvioEvent} from 'Event'
import axios from 'axios'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createPointsSummary} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/PointsSummary'

const mockRxPost = mockRxJsAjax.post as jest.Mock
const mockAxiosPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should configure points', async () => {
  const event = fakeEvent({template: fakeSimpleBlog()})
  const {queryByText, findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  expect(queryByText(/you've earned/i)).not.toBeInTheDocument()

  fireEvent.click(await findByText(/add item/i))

  fireEvent.mouseDown(await findByLabelText('select sidebar item'))
  fireEvent.click(await findByText(/points summary/i))
  fireEvent.click(await findByLabelText('add item'))

  // Saved
  await wait(() => {
    expect(mockRxPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockRxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems[0].type).toBe('Points Summary')
})

it('should remove points', async () => {
  const summary = 'your points'
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createPointsSummary(),
          summary,
        },
      ],
    }),
  })

  const {queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  expect(await findByText(new RegExp(summary))).toBeInTheDocument()

  fireEvent.click(await findByText(/edit points summary/i))
  fireEvent.click(await findByText(/remove/i))

  await wait(() => {
    expect(queryByText(/you've earned/i)).not.toBeInTheDocument()
  })

  // Saved
  await wait(() => {
    expect(mockRxPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockRxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems.length).toBe(0)
})

it('should upload a logo', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')

  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [createPointsSummary()],
    }),
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  fireEvent.click(await findByText(/edit points summary/i))

  const logo = new File([], 'mylogo.jpg')
  const logoInput = await findByLabelText('points_summary_logo image input')
  Object.defineProperty(logoInput, 'files', {
    value: [logo],
  })

  const logoData = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const withLogo: ObvioEvent = {...event, points_summary_logo: logoData}

  mockAxiosPost.mockImplementationOnce(() => Promise.resolve({data: withLogo}))

  fireEvent.change(logoInput)

  await wait(() => {
    expect(mockAxiosPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockAxiosPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.get('points_summary_logo')).toBe(logo)
})

it('should remove the logo', async () => {
  const logo = {
    url: faker.internet.url(),
    name: faker.random.word(),
  }
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [createPointsSummary()],
    }),
    points_summary_logo: logo,
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  fireEvent.click(await findByText(/edit points summary/i))

  const withoutLogo: ObvioEvent = {...event, points_summary_logo: null}
  mockPut.mockImplementationOnce(() => Promise.resolve({data: withoutLogo}))

  user.click(await findByLabelText('remove points_summary_logo image'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.points_summary_logo).toBe(null)
})
