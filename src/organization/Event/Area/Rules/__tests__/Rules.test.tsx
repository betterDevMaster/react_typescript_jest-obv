import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeRule} from 'organization/Event/Area/Rules/__utils__/factory'
import {fireEvent, wait} from '@testing-library/dom'

const mockGet = axios.get as jest.Mock
const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure rules', async () => {
  const area = fakeArea()
  const {
    findByLabelText,
    findByText,
    findAllByLabelText,
    event,
  } = await goToAreas({
    areas: [area],
    userPermissions: [CONFIGURE_EVENTS],
  })

  const roomOne = fakeRoom()
  const roomTwo = fakeRoom()

  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: [roomOne, roomTwo]}),
  )

  user.click(await findByLabelText(`view ${area.name} area`))

  /**
   * Start with one rule assigned to room one
   */
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: [fakeRule({rooms: [roomOne.id]})]}),
  )

  user.click(await findByText(/rules/i))

  /**
   * Add a condition
   */
  user.click(await findByText(/none/i))
  user.click(await findByText(/add rule/i))

  const tag = 'foo'
  fireEvent.mouseDown(await findByLabelText('pick rule source'))
  user.click(await findByText(/tags/i))
  user.type(await findByLabelText('new tag target'), tag)
  user.click(await findByLabelText('save rule'))
  user.click(await findByLabelText('close dialog'))

  /**
   * Set room
   */
  user.click(await findByText(/new rule/i))
  user.click((await findAllByLabelText('select rooms'))[1])
  user.click(await findByLabelText(`select ${roomTwo.name}`))
  user.click(await findByLabelText('close dialog'))

  /**
   * Test deleting a room
   */
  user.click(await findByText(/new rule/i)) // add a rule
  user.click((await findAllByLabelText('remove rule'))[2]) // and delete immediately

  mockPut.mockImplementationOnce(() => Promise.resolve({data: []}))

  user.click(await findByText(/save/i))

  /**
   * Did set the returned rules
   */
  expect(await findByText(/no rules/i))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/areas/${area.id}/rules`)

  expect(data.rules.length).toBe(2)

  // Set condition correctly
  expect(data.rules[0].conditions[0].target).toBe(tag)

  // existing room still set
  expect(data.rules[0].rooms[0]).toBe(roomOne.id)

  // set new room
  expect(data.rules[1].rooms[0]).toBe(roomTwo.id)
})
