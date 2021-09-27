import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {Area} from 'organization/Event/AreasProvider'
import {fireEvent, wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {
  goToArea,
  goToAreas,
} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should update an area open status', async () => {
  const {areas, findByLabelText} = await goToAreas({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const targetIndex = faker.random.number({min: 0, max: areas.length - 1})
  const target = areas[targetIndex]

  // Get area
  mockGet.mockImplementationOnce(() => Promise.resolve({data: target}))
  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  // metrics
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

it('should update an area re-assign offline status', async () => {
  const {areas, findByLabelText} = await goToAreas({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const targetIndex = faker.random.number({min: 0, max: areas.length - 1})
  const target = areas[targetIndex]

  // Get area
  mockGet.mockImplementationOnce(() => Promise.resolve({data: target}))
  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  // metrics
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  // go to area config
  user.click(await findByLabelText(`view ${target.name} area`))

  const updated: Area = {
    ...target,
    reassign_on_offline: !target.reassign_on_offline,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('toggle re-assign on offline'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]
  expect(url).toMatch(`/areas/${target.id}`)
  // Was toggled -- ie. sent opposite of current open status
  expect(data.reassign_on_offline).toBe(!target.reassign_on_offline)

  // Checkbox was updated
  const isChecked = ((await findByLabelText(
    'toggle re-assign on offline',
  )) as HTMLInputElement).checked
  expect(isChecked).toBe(!target.reassign_on_offline)
})

it('should require confirmation to turn off re-assign for Tech Check area', async () => {
  const area = fakeArea({
    reassign_on_offline: true,
    is_tech_check: true,
  })
  const {findByLabelText, findByText} = await goToArea({
    userPermissions: [CONFIGURE_EVENTS],
    area,
  })

  const updated: Area = {
    ...area,
    reassign_on_offline: !area.reassign_on_offline,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('toggle re-assign on offline'))
  user.click(await findByText(/confirm/i)) // require confirmation

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]
  expect(url).toMatch(`/areas/${area.id}`)
  // Was toggled -- ie. sent opposite of current open status
  expect(data.reassign_on_offline).toBe(false)

  // Checkbox was updated
  const isChecked = ((await findByLabelText(
    'toggle re-assign on offline',
  )) as HTMLInputElement).checked
  expect(isChecked).toBe(false)
})

it('should update the area name', async () => {
  const area = fakeArea({
    reassign_on_offline: true,
    is_tech_check: true,
  })
  const {findByLabelText} = await goToArea({
    userPermissions: [CONFIGURE_EVENTS],
    area,
  })

  const name = 'myupdatedarea'

  const updated: Area = {
    ...area,
    name,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  fireEvent.change(await findByLabelText('area name'), {
    target: {
      value: name,
    },
  })

  user.click(await findByLabelText('save name'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]
  expect(url).toMatch(`/areas/${area.id}`)
  // Was toggled -- ie. sent opposite of current open status
  expect(data.name).toBe(name)
})
