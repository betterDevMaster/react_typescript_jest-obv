import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fireEvent, wait} from '@testing-library/dom'
import {fakeEvent} from 'Event/__utils__/factory'
import {ObvioEvent} from 'Event'
import axios from 'axios'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createPointsSummary} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/PointsSummary'
import {createHashMap} from 'lib/list'
import {REMOVE} from 'Event/TemplateUpdateProvider'

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
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  const values = Object.values(data.template)
  expect(values).toContain('Points Summary')
})

it('should remove points', async () => {
  const summary = 'your points'
  const sidebarItems = createHashMap([
    {
      ...createPointsSummary(),
      summary,
    },
  ])
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems,
    }),
  })

  const {queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  expect(await findByText(new RegExp(summary))).toBeInTheDocument()

  fireEvent.click(await findByText(/remove points summary/i))

  await wait(() => {
    expect(queryByText(/you've earned/i)).not.toBeInTheDocument()
  })

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const id = Object.keys(sidebarItems)[0]
  expect(data.template[`sidebarItems.${id}`]).toBe(REMOVE)
})

it('should upload a logo', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')

  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: createHashMap([createPointsSummary()]),
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
      sidebarItems: createHashMap([createPointsSummary()]),
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
