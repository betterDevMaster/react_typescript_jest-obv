import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {
  fakeCardsNavButton,
  fakeCardsNavButtons,
} from 'Event/template/Cards/Dashboard/CardsNavButton/__utils__/factory'
import {REMOVE} from 'Event/TemplateUpdateProvider'
import {orderedIdsByPosition} from 'lib/list'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should render main nav buttons', async () => {
  const oneRowButtons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    () => fakeCardsNavButton({row: 1}),
  )
  const twoRowButtons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    () => fakeCardsNavButton({row: 2}),
  )

  const buttons = oneRowButtons.concat(twoRowButtons)

  const {buttonsMap: mainNavButtons} = fakeCardsNavButtons(buttons)
  const {findAllByLabelText} = await goToDashboardConfig({
    event: fakeEvent({
      template: fakeCards({
        mainNav: {buttons: mainNavButtons},
      }),
    }),
  })

  const buttonsEls = await findAllByLabelText('main nav button')
  expect(buttonsEls.length).toBe(buttons.length)
})

it('should add a new main nav button', async () => {
  const numButtons = faker.random.number({min: 1, max: 4})

  const buttons = Array.from(
    {
      length: numButtons,
    },
    fakeCardsNavButton,
  )

  const {buttonsMap: mainNavButtons} = fakeCardsNavButtons(buttons)
  const event = fakeEvent({
    template: fakeCards({
      mainNav: {buttons: mainNavButtons},
    }),
  })

  const {findAllByLabelText, findByLabelText} = await goToDashboardConfig({
    event,
  })

  const buttonEls = () => findAllByLabelText('main nav button')

  expect((await buttonEls()).length).toBe(numButtons)

  fireEvent.click(await findByLabelText('add main nav button'))
  fireEvent.click(await findByLabelText('save'))

  await wait(async () => {
    expect((await buttonEls()).length).toBe(numButtons + 1)
  })

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  const values = Object.values(data.template)
  expect(values).toContain('Button') // Default button text
})

it('should remove the button', async () => {
  const numButtons = faker.random.number({min: 2, max: 4})

  const buttons = Array.from({length: numButtons}, fakeCardsNavButton)
  const {buttonsMap: mainNavButtons} = fakeCardsNavButtons(buttons)
  const event = fakeEvent({
    template: fakeCards({mainNav: {buttons: mainNavButtons}}),
  })

  const {
    findAllByLabelText,
    findByLabelText,
    queryByText,
  } = await goToDashboardConfig({
    event,
  })

  const buttonEls = () => findAllByLabelText('main nav button')
  expect((await buttonEls()).length).toBe(numButtons)

  const targetIndex = faker.random.number({min: 0, max: numButtons - 1})
  const target = (await buttonEls())[targetIndex]
  expect(queryByText(target.textContent!)).toBeInTheDocument()

  clickEdit(target)

  fireEvent.click(await findByLabelText('remove button'))

  expect((await buttonEls()).length).toBe(numButtons - 1)

  expect(queryByText(target.textContent!)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const ids = orderedIdsByPosition(mainNavButtons)
  const id = ids[targetIndex]
  expect(data.template[`mainNav.buttons.${id}`]).toBe(REMOVE)
})
