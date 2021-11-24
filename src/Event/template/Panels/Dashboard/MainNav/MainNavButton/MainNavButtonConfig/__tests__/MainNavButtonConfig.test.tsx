import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import mockAxios from 'axios'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import axios from 'axios'

const mockPut = axios.put as jest.Mock
const mockGet = mockAxios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should edit the selected button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButtonWithSize,
  )

  const navButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakePanels({
      nav: navButtons,
    }),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  const targetIndex = faker.random.number({min: 0, max: buttons.length - 1})
  const button = buttons[targetIndex]
  const buttonEl = await findByText(button.text)

  clickEdit(buttonEl)

  const textInput = (await findByLabelText(
    'button name input',
  )) as HTMLInputElement
  expect(textInput.value).toBe(button.text)

  const updatedValue = faker.random.word()

  fireEvent.change(textInput, {
    target: {
      value: updatedValue,
    },
  })

  fireEvent.click(await findByLabelText('save'))

  const updatedEl = await findByText(updatedValue)
  expect(updatedEl).toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  const id = navButtons.ids[targetIndex]
  expect(data.template[`nav.entities.${id}.text`]).toBe(updatedValue)
})

it('should set an area button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButtonWithSize,
  )

  const mainNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakePanels({
      nav: mainNavButtons,
    }),
  })

  const areas = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeArea,
  )

  const {findByLabelText, findByText} = await goToDashboardConfig({
    areas,
    event,
  })

  const targetIndex = faker.random.number({min: 0, max: buttons.length - 1})
  const button = buttons[targetIndex]
  const buttonEl = await findByText(button.text)

  const target = faker.random.arrayElement(areas)

  clickEdit(buttonEl)

  user.click(await findByLabelText('configure button to join room'))

  /**
   * Material UI select expects mouseDown instead of a click
   */
  fireEvent.mouseDown(await findByLabelText('pick area'))
  user.click(await findByLabelText(`pick ${target.name}`))

  fireEvent.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  const id = mainNavButtons.ids[targetIndex]
  expect(data.template[`nav.entities.${id}.isAreaButton`]).toBe(true)
  expect(data.template[`nav.entities.${id}.areaId`]).toBe(target.key) // Set area ID
})

it('should assign an action for points', async () => {
  const button = fakeNavButtonWithSize()
  const mainNavButtons = createEntityList([button])
  const event = fakeEvent({
    template: fakePanels({
      nav: mainNavButtons,
    }),
  })

  const actions = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    () => fakeAction(),
  )

  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
    actions,
  })

  const buttonEl = await findByText(button.text)

  const target = faker.random.arrayElement(actions)

  clickEdit(buttonEl)

  /**
   * Material UI select expects mouseDown instead of a click
   */
  fireEvent.mouseDown(await findByLabelText('pick action'))
  user.click(await findByLabelText(`pick ${target.description}`))

  fireEvent.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  const savedButtonId = mainNavButtons.ids[0]
  expect(data.template[`nav.entities.${savedButtonId}.actionId`]).toBe(
    target.key,
  ) // Did assign action id
})

it('should set an infusionsoft tag', async () => {
  const button = fakeNavButtonWithSize()
  const mainNavButtons = createEntityList([button])
  const event = fakeEvent({
    template: fakePanels({
      nav: mainNavButtons,
    }),
    has_infusionsoft: true,
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  const buttonEl = await findByText(button.text)

  const name = faker.random.word()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {name}}))

  clickEdit(buttonEl)

  const id = faker.random.number({min: 1000, max: 10000})

  user.type(await findByLabelText('infusionsoft tag id'), String(id))
  user.click(await findByLabelText('set tag id'))

  user.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  const savedButtonId = mainNavButtons.ids[0]
  expect(
    data.template[`nav.entities.${savedButtonId}.infusionsoftTag.id`],
  ).toBe(id)
})

it('should not have a page select', async () => {
  const externalLink = faker.internet.url()
  const button = fakeNavButtonWithSize({
    page: undefined,
    link: externalLink,
  })
  const navButtons = createEntityList([button])

  const event = fakeEvent({
    template: fakePanels({
      nav: navButtons,
    }),
  })

  const {findByText, queryByLabelText} = await goToDashboardConfig({event})

  const buttonEl = async () => await findByText(button.text)

  // Started with absolute link
  const href = async () => {
    return (await buttonEl()).parentElement?.getAttribute('href')
  }
  expect(await href()).toBe(externalLink)

  clickEdit(await buttonEl())

  expect(queryByLabelText('pick page')).not.toBeInTheDocument()
})
