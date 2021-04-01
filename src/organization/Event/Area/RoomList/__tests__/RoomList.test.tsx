import faker from 'faker'
import axios from 'axios'
import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import user from '@testing-library/user-event'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'

const mockGet = axios.get as jest.Mock

it('should render list of rooms', async () => {
  const {areas, findByLabelText, findByText} = await goToAreas()

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))

  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  for (const room of rooms) {
    expect(await findByText(room.name)).toBeInTheDocument()
  }
})
