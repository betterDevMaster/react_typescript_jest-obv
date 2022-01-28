import faker from 'faker'
import {fireEvent, wait} from '@testing-library/react'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {
  fakeAgenda,
  fakeAgendaList,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'
import {createHashMap, orderedIdsByPosition} from 'lib/list'
import {REMOVE} from 'Event/TemplateUpdateProvider'
import {inputElementFor} from '__utils__/render'
import {TAGS} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/TagsRule'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should add an agenda list', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog(),
  })
  const {
    findAllByText,
    findByLabelText,
    findByText,
  } = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/add item/i))
  fireEvent.mouseDown(await findByLabelText('select sidebar item'))
  fireEvent.click(await findByText(/agendas/i))
  fireEvent.click(await findByLabelText('add item'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect((await findAllByText(/agenda/i)).length).toBeGreaterThan(0)

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const values = Object.values(data.template)
  expect(values).toContain('Agenda List')
})

it('should remove an agenda list', async () => {
  const sidebarItems = createHashMap([fakeAgendaList()])
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarItems,
    }),
  })
  const {queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/remove agenda/i))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(queryByText(/remove agenda/i)).not.toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const id = Object.keys(sidebarItems)[0]
  expect(data.template[`sidebarItems.${id}`]).toBe(REMOVE)
})

it('should edit an agenda', async () => {
  const numAgendas = faker.random.number({min: 2, max: 4})
  const list = Array.from({length: numAgendas}, fakeAgenda)
  const items = createHashMap(list)

  const title = faker.random.word()
  const sidebarItems = createHashMap([fakeAgendaList({title, items})])
  const dashboard = fakeSimpleBlog({
    sidebarItems,
  })
  const event = fakeEvent({template: dashboard})

  const {findAllByLabelText, findByLabelText} = await goToDashboardConfig({
    event,
  })

  const targetIndex = faker.random.number({min: 0, max: list.length - 1})

  // Renders same values as data
  expect(
    (await findAllByLabelText('agenda event'))[targetIndex].textContent,
  ).toBe(list[targetIndex].text)

  clickEdit((await findAllByLabelText('agenda'))[targetIndex])

  const updatedText = faker.random.word()

  user.type(await findByLabelText('agenda text'), updatedText)

  user.click(await findByLabelText('save'))

  // Has updated text
  expect(
    (await findAllByLabelText('agenda event'))[targetIndex].textContent,
  ).toBe(updatedText)

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const sidebarId = Object.keys(sidebarItems)[0]
  const sortedIds = orderedIdsByPosition(items)
  const agendaId = sortedIds[targetIndex]

  expect(
    data.template[`sidebarItems.${sidebarId}.items.${agendaId}.text`],
  ).toBe(updatedText)
})

it('should add a new agenda', async () => {
  const title = faker.random.word()
  const sidebarItems = createHashMap([
    fakeAgendaList({title, items: createHashMap([])}),
  ])

  const dashboard = fakeSimpleBlog({
    sidebarItems,
  })
  const event = fakeEvent({template: dashboard})

  const {
    findAllByLabelText,
    findByLabelText,
    queryByLabelText,
  } = await goToDashboardConfig({event})

  expect(queryByLabelText('agenda')).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('add agenda event'))

  user.click(await findByLabelText('save'))

  expect((await findAllByLabelText('agenda')).length).toBe(1)

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const values = Object.values(data.template)
  expect(values).toContain('Event') // default agenda event name
})

it('should remove an agenda', async () => {
  const numItems = faker.random.number({min: 2, max: 4})
  const list = Array.from({length: numItems}, fakeAgenda)
  const items = createHashMap(list)
  const title = faker.random.word()
  const sidebarItems = createHashMap([fakeAgendaList({title, items})])

  const dashboard = fakeSimpleBlog({
    sidebarItems,
  })
  const event = fakeEvent({template: dashboard})

  const {
    queryByText,
    findAllByLabelText,
    findByLabelText,
    findByText,
  } = await goToDashboardConfig({event})

  const targetIndex = faker.random.number({min: 0, max: list.length - 1})

  const targetText = list[targetIndex].text

  expect(await findByText(targetText)).toBeInTheDocument()

  clickEdit((await findAllByLabelText('agenda'))[targetIndex])

  fireEvent.click(await findByLabelText('remove agenda'))

  // one less agenda
  expect((await findAllByLabelText('agenda event')).length).toBe(
    list.length - 1,
  )

  expect(queryByText(targetText)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const sidebarId = Object.keys(sidebarItems)[0]
  const sortedIds = orderedIdsByPosition(items)
  const itemId = sortedIds[targetIndex]

  expect(data.template[`sidebarItems.${sidebarId}.items.${itemId}`]).toBe(
    REMOVE,
  )
})

it('should update agendas list title', async () => {
  const list = Array.from(
    {length: faker.random.number({min: 2, max: 4})},
    fakeAgenda,
  )
  const items = createHashMap(list)
  const title = faker.random.word()
  const sidebarItems = createHashMap([fakeAgendaList({title, items})])
  const dashboard = fakeSimpleBlog({
    sidebarItems,
  })
  const event = fakeEvent({template: dashboard})

  const {findByLabelText} = await goToDashboardConfig({event})

  clickEdit(await findByLabelText('agendas'))
  const updatedTitle = faker.random.words(2)

  user.type(await findByLabelText('update agendas title'), updatedTitle)

  user.click(await findByLabelText('save'))

  expect((await findByLabelText('agendas')).textContent).toBe(updatedTitle)

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const sidebarId = Object.keys(sidebarItems)[0]

  expect(data.template[`sidebarItems.${sidebarId}.title`]).toBe(updatedTitle)
})

it('should save  rules', async () => {
  const sidebarItems = createHashMap([fakeAgendaList()])
  const dashboard = fakeSimpleBlog({
    sidebarItems,
  })
  const event = fakeEvent({template: dashboard})

  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  clickEdit(await findByLabelText('agendas'))
  user.click(await findByText(/visibility rules/i))

  user.click(await findByLabelText('add rule'))

  // Select tags as source
  fireEvent.change(inputElementFor(await findByLabelText('pick rule source')), {
    target: {
      value: TAGS,
    },
  })

  const target = faker.random.word()
  user.type(await findByLabelText('new tag target'), target)

  user.click(await findByLabelText('save rule'))
  user.click(await findByLabelText('close rules config'))
  user.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const sidebarId = Object.keys(sidebarItems)[0]

  expect(data.template[`sidebarItems.${sidebarId}.rules`][0].target).toBe(
    target,
  )
})
