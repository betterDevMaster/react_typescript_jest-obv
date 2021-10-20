import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {fakeCardsNavButton} from 'Event/template/Cards/Dashboard/CardsNavButton/__utils__/factory'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
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

  const mainNavButtons = createEntityList(buttons)
  const {findAllByLabelText} = await goToDashboardConfig({
    event: fakeEvent({
      template: fakeCards({
        mainNav: mainNavButtons,
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
    fakeCardsNavButton,
  )

  const mainNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeCards({
      mainNav: mainNavButtons,
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
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.mainNav.ids.length).toBe(numButtons + 1)
})

it('should remove the button', async () => {
  const numButtons = faker.random.number({min: 2, max: 4})

  const buttons = Array.from({length: numButtons}, fakeCardsNavButton)
  const mainNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeCards({mainNav: mainNavButtons}),
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

  const target = faker.random.arrayElement(await buttonEls())
  expect(queryByText(target.textContent!)).toBeInTheDocument()

  clickEdit(target)

  fireEvent.click(await findByLabelText('remove button'))

  expect((await buttonEls()).length).toBe(numButtons - 1)

  expect(queryByText(target.textContent!)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.mainNav.ids.length).toBe(numButtons - 1)
})