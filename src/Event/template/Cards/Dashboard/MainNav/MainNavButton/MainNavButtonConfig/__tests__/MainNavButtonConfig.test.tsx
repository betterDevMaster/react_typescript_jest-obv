import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import mockAxios from 'axios'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {
  fakeCardsNavButton,
  fakeCardsNavButtons,
} from 'Event/template/Cards/Dashboard/CardsNavButton/__utils__/factory'

const mockPut = mockAxios.put as jest.Mock
const mockGet = mockAxios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should edit the selected button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeCardsNavButton,
  )

  const {targetId, buttonsMap: mainNavButtons} = fakeCardsNavButtons(buttons)
  const event = fakeEvent({
    template: fakeCards({
      mainNav: {
        buttons: mainNavButtons,
      },
    }),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  const button = mainNavButtons[targetId]
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
  expect(data.template[`mainNav.buttons.${targetId}.text`]).toBe(updatedValue)
})

it('should set an area button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeCardsNavButton,
  )

  const {targetId: targetKey, buttonsMap: mainNavButtons} = fakeCardsNavButtons(
    buttons,
  )
  const event = fakeEvent({
    template: fakeCards({
      mainNav: {
        buttons: mainNavButtons,
      },
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

  const button = mainNavButtons[targetKey]
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
  expect(data.template[`mainNav.buttons.${targetKey}.isAreaButton`]).toBe(true)
  expect(data.template[`mainNav.buttons.${targetKey}.areaId`]).toBe(target.key) // Set area ID
})

it('should assign an action for points', async () => {
  const button = fakeCardsNavButton()
  const {targetId, buttonsMap} = fakeCardsNavButtons([button])
  const event = fakeEvent({
    template: fakeCards({
      mainNav: {buttons: buttonsMap},
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

  expect(data.template[`mainNav.buttons.${targetId}.actionId`]).toBe(target.key) // Did assign action id
})

it('should set an infusionsoft tag', async () => {
  const button = fakeCardsNavButton()
  const {targetId, buttonsMap: mainNav} = fakeCardsNavButtons([button])
  const event = fakeEvent({
    template: fakeCards({
      mainNav: {
        buttons: mainNav,
      },
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

  expect(data.template[`mainNav.buttons.${targetId}.infusionsoftTag.id`]).toBe(
    id,
  )
})
