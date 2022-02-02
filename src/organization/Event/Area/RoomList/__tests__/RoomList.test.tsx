import faker from 'faker'
import axios from 'axios'
import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import user from '@testing-library/user-event'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {START_ROOMS} from 'organization/PermissionsProvider'
import {wait} from '@testing-library/dom'

const mockGet = axios.get as jest.Mock

it('should render list of rooms', async () => {
  const {areas, findByLabelText, findByText} = await goToAreas({
    userPermissions: [START_ROOMS],
  })

  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(10 + areas.length)
  })

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))

  // start url
  const url = faker.internet.url()
  for (const room of rooms) {
    if (room.is_online) {
      mockGet.mockImplementationOnce(() => Promise.resolve({data: {url}}))
    }
  }

  // metrics
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  for (const room of rooms) {
    expect(await findByText(String(room.number))).toBeInTheDocument()
  }
})
