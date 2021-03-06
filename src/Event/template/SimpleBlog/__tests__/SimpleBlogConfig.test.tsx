import user from '@testing-library/user-event'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import {rgba} from 'lib/color'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should upload a header background', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')

  const event = fakeEvent({template: fakeSimpleBlog(), header_background: null})
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

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
  mockPost.mockImplementationOnce(() => Promise.resolve({data: withHeaderBg}))

  fireEvent.change(headerBgInput)

  user.click(await findByLabelText('cancel image resize'))

  user.click(await findByLabelText('save'))

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
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('header'))

  user.click(await findByLabelText('remove header_background image'))

  const withoutHeaderBg: ObvioEvent = {...event, header_background: null}
  mockPut.mockImplementationOnce(() => Promise.resolve({data: withoutHeaderBg}))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.header_background).toBe(null)
})

it('should configure a header color settings', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog(),
  })
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('header'))

  const color = '#e8e8e8'
  user.type(await findByLabelText('header background color'), color)

  user.click(await findByLabelText('save'))

  await wait(async () => {
    expect(await findByLabelText('header')).toHaveStyle(
      `background-color: ${rgba(color)}`,
    )
  })
})
