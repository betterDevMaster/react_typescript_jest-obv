import axios from 'axios'
import user from '@testing-library/user-event'
import {
  goToArea,
  goToAreas,
} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {wait} from '@testing-library/react'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'

const mockDelete = axios.delete as jest.Mock
const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should remove an area', async () => {
  const target = fakeArea()
  const areas = [target, fakeArea()]

  const event = fakeEvent({
    has_started: false, // can delete
  })

  const {findByLabelText, findByText, findAllByLabelText} = await goToAreas({
    userPermissions: [CONFIGURE_EVENTS],
    areas,
    event,
  })

  // Get area
  mockGet.mockImplementationOnce(() => Promise.resolve({data: target}))
  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  // metrics
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  // go to area config
  user.click(await findByLabelText(`view ${target.name} area`))

  mockDelete.mockImplementation(() => Promise.resolve({data: ''}))

  const removed = areas.filter((a) => a.id !== target.id)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: removed}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // metrics

  user.click(await findByLabelText('delete area'))
  user.click(await findByText(/confirm/i))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  const [url] = mockDelete.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/areas/${target.id}`)

  expect((await findAllByLabelText(/view.*area/)).length).toBe(1)
})
