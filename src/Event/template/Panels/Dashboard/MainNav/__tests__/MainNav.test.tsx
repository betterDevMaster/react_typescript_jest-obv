import faker from 'faker'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit, clickDuplicate} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render main nav buttons', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButtonWithSize,
  )

  const mainNavButtons = createEntityList(buttons)
  const {findAllByLabelText} = await goToDashboardConfig({
    event: fakeEvent({
      template: fakePanels({
        nav: mainNavButtons,
      }),
    }),
  })

  const buttonsEls = await findAllByLabelText('main nav button')
  expect(buttonsEls.length).toBe(mainNavButtons.ids.length)
})

it('should add a new main nav button', async () => {
  const numButtons = faker.random.number({min: 1, max: 4})

  const buttons = Array.from(
    {
      length: numButtons,
    },
    fakeNavButtonWithSize,
  )

  const mainNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakePanels({
      nav: mainNavButtons,
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
  expect(data.template['nav.ids'].length).toBe(numButtons + 1)
})

it('should duplicate a main navbutton', async () => {
  const numButtons = faker.random.number({min: 2, max: 4})

  const buttons = Array.from({length: numButtons}, fakeNavButtonWithSize)
  const mainNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakePanels({nav: mainNavButtons}),
  })

  const {
    findAllByLabelText,
    findByLabelText,
    queryByText,
  } = await goToDashboardConfig({event})

  const buttonEls = () => findAllByLabelText('main nav button')
  expect((await buttonEls()).length).toBe(numButtons)

  const target = faker.random.arrayElement(await buttonEls())
  expect(queryByText(target.textContent!)).toBeInTheDocument()

  clickDuplicate(target)

  fireEvent.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template['nav.ids'].length).toBe(numButtons + 1)
})

it('should remove the button', async () => {
  const numButtons = faker.random.number({min: 2, max: 4})

  const buttons = Array.from({length: numButtons}, fakeNavButtonWithSize)
  const mainNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakePanels({nav: mainNavButtons}),
  })

  const {
    findAllByLabelText,
    findByLabelText,
    queryByText,
  } = await goToDashboardConfig({event})

  const buttonEls = () => findAllByLabelText('main nav button')
  expect((await buttonEls()).length).toBe(numButtons)

  const target = faker.random.arrayElement(await buttonEls())
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
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template['nav.ids'].length).toBe(numButtons - 1)
})
