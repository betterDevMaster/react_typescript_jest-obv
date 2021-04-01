import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {Area} from 'organization/Event/AreasProvider'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should update an area', async () => {
  const {areas, findByLabelText} = await goToAreas({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const targetIndex = faker.random.number({min: 0, max: areas.length - 1})
  const target = areas[targetIndex]

  // Get area
  mockGet.mockImplementationOnce(() => Promise.resolve({data: target}))
  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  // go to area config
  user.click(await findByLabelText(`view ${target.name} area`))

  const updated: Area = {
    ...target,
    is_open: !target.is_open,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('toggle area open status'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]
  expect(url).toMatch(`/areas/${target.id}`)
  // Was toggled -- ie. sent opposite of current open status
  expect(data.is_open).toBe(!target.is_open)

  // Checkbox was updated
  const isChecked = ((await findByLabelText(
    'toggle area open status',
  )) as HTMLInputElement).checked
  expect(isChecked).toBe(!target.is_open)
})
