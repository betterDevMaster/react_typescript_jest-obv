import faker from 'faker'
import {loginToEventSite} from 'Event/__utils__/url'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'

const mockGet = axios.get as jest.Mock

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

beforeEach(() => {
  jest.clearAllMocks()
})

it('should launch zoom meeting', async () => {
  const areaId = faker.random.number({min: 1000, max: 10000})

  const joinUrl = faker.internet.url()

  await loginToEventSite({
    event: fakeEvent({
      template: fakePanels(),
    }),
    pathname: `/area/${areaId}`,
    skipLogin: true,
  })

  mockGet.mockImplementation(() => Promise.resolve({data: {url: joinUrl}}))

  await wait(() => {
    expect(window.location.href).toBe(joinUrl)
  })

  const [url] = mockGet.mock.calls[5]
  expect(url).toMatch(`/areas/${areaId}/join`)
})

it('should show generic offline message', async () => {
  const areaId = faker.random.number({min: 1000, max: 10000})

  const {findByText} = await loginToEventSite({
    event: fakeEvent({
      template: fakePanels(),
    }),
    pathname: `/area/${areaId}`,
    skipLogin: true,
  })

  mockGet.mockImplementation(() => Promise.reject('some unexpected error'))

  expect(await findByText(/area is currently offline/i)).toBeInTheDocument()
})

it('should show defined offline message', async () => {
  const areaId = faker.random.number({min: 1000, max: 10000})

  mockGet.mockImplementation(() =>
    Promise.reject({
      response: {
        data: {
          offline_title: offlineTitle,
        },
      },
    }),
  )

  const {findByText} = await loginToEventSite({
    event: fakeEvent({
      template: fakePanels(),
    }),
    pathname: `/area/${areaId}`,
    skipLogin: true,
  })

  const offlineTitle = faker.lorem.sentence()

  expect(await findByText(offlineTitle)).toBeInTheDocument()
})
