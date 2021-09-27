import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {fireEvent} from '@testing-library/react'
import {clickDuplicate, clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import NavButton from 'Event/Dashboard/components/NavButton'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createSidebarNav} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/SidebarNav'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should add a sidebar nav', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog(),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/add item/i))
  fireEvent.mouseDown(await findByLabelText('select sidebar item'))
  fireEvent.click(await findByText(/sidebar buttons/i))
  fireEvent.click(await findByLabelText('add item'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(/remove buttons/i)).toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems[0].type).toBe('Sidebar Nav')
})

it('should remove a sidebar nav', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [createSidebarNav()],
    }),
  })
  const {queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/remove buttons/i))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  expect(queryByText(/remove buttons/i)).not.toBeInTheDocument()

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems.length).toBe(0)
})

it('should add a new sidebar nav button', async () => {
  const numButtons = faker.random.number({min: 1, max: 4})

  const buttons = Array.from(
    {
      length: numButtons,
    },
    fakeNavButton,
  )

  const sidebarNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createSidebarNav(),
          ...sidebarNavButtons,
        },
      ],
    }),
  })

  const {findAllByLabelText, findByLabelText} = await goToDashboardConfig({
    event,
  })

  const buttonEls = () => findAllByLabelText('sidebar nav button')

  expect((await buttonEls()).length).toBe(numButtons)

  fireEvent.click(await findByLabelText('add sidebar nav button'))

  expect((await buttonEls()).length).toBe(numButtons + 1)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems[0].ids.length).toBe(numButtons + 1)
})

it('should add a new button when there are none', async () => {
  const buttons: NavButton[] = []

  const sidebarNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createSidebarNav(),
          ...sidebarNavButtons,
        },
      ],
    }),
  })

  const {findAllByLabelText, findByLabelText} = await goToDashboardConfig({
    event,
  })

  const buttonEls = () => findAllByLabelText('sidebar nav button')

  fireEvent.click(await findByLabelText('add sidebar nav button'))

  expect((await buttonEls()).length).toBe(1)

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebarItems[0].ids.length).toBe(1)
})

it('should duplicate the selected button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButton,
  )

  const sidebarNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createSidebarNav(),
          ...sidebarNavButtons,
        },
      ],
    }),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  const targetIndex = faker.random.number({min: 0, max: buttons.length - 1})
  const button = buttons[targetIndex]
  const buttonEl = await findByText(button.text)

  clickDuplicate(buttonEl)

  const textInput = (await findByLabelText(
    'button name input',
  )) as HTMLInputElement
  expect(textInput.value).toBe(button.text)

  fireEvent.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template.sidebarItems[0].ids.length).toBe(buttons.length + 1)
  const newButtonId =
    data.template.sidebarItems[0].ids[
      data.template.sidebarItems[0].ids.length - 1
    ]
  const newButton = data.template.sidebarItems[0].entities[newButtonId]

  expect(newButton.text).toBe(button.text)
})

it('should edit the selected button', async () => {
  const buttons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButton,
  )

  const sidebarNavButtons = createEntityList(buttons)
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createSidebarNav(),
          ...sidebarNavButtons,
        },
      ],
    }),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

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
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  const id = data.template.sidebarItems[0].ids[targetIndex]
  expect(data.template.sidebarItems[0].entities[id].text).toBe(updatedValue)
})

it('should remove the button', async () => {
  const numButtons = faker.random.number({min: 2, max: 4})

  const buttons = Array.from({length: numButtons}, fakeNavButton)
  const sidebarNavButtons = createEntityList(buttons)

  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems: [
        {
          ...createSidebarNav(),
          ...sidebarNavButtons,
        },
      ],
    }),
  })
  const {
    findAllByLabelText,
    findByLabelText,
    queryByText,
  } = await goToDashboardConfig({
    event,
  })

  const buttonEls = () => findAllByLabelText('sidebar nav button')
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
  expect(data.template.sidebarItems[0].ids.length).toBe(numButtons - 1)
})
