import faker from 'faker'
import {fireEvent, wait} from '@testing-library/react'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {
  fakeAgenda,
  fakeAgendaList,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/AgendaList/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'
import {createEntityList} from 'lib/list'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should add an agenda list', async () => {
  const event = fakeEvent({
    template: fakeCards(),
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

  const id = data.template['sidebarItems.ids'][0]
  expect(data.template[`sidebarItems.entities.${id}.type`]).toBe('Agenda List')
})

it('should remove an agenda list', async () => {
  const sidebarItems = createEntityList([fakeAgendaList()])

  const event = fakeEvent({
    template: fakeCards({
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
  expect(data.template['sidebarItems.ids'].length).toBe(0)
})

it('should edit an agenda', async () => {
  const list = Array.from(
    {length: faker.random.number({min: 2, max: 4})},
    fakeAgenda,
  )
  const items = createEntityList(list)

  const title = faker.random.word()
  const sidebarItems = createEntityList([fakeAgendaList({title, items})])

  const dashboard = fakeCards({
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

  const sidebarId = sidebarItems.ids[0]
  const agendaId = items.ids[targetIndex]
  expect(
    data.template[
      `sidebarItems.entities.${sidebarId}.items.entities.${agendaId}.text`
    ],
  ).toBe(updatedText)
})

it('should add a new agenda', async () => {
  const title = faker.random.word()
  const sidebarItems = createEntityList([
    fakeAgendaList({title, items: createEntityList([])}),
  ])

  const dashboard = fakeCards({
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
  const sidebarId = sidebarItems.ids[0]
  expect(
    data.template[`sidebarItems.entities.${sidebarId}.items.ids`].length,
  ).toBe(1)
})

it('should remove an agenda', async () => {
  const numItems = faker.random.number({min: 2, max: 4})

  const list = Array.from({length: numItems}, fakeAgenda)
  const items = createEntityList(list)

  const title = faker.random.word()
  const sidebarItems = createEntityList([fakeAgendaList({title, items})])

  const dashboard = fakeCards({
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

  const sidebarId = sidebarItems.ids[0]
  expect(
    data.template[`sidebarItems.entities.${sidebarId}.items.ids`].length,
  ).toBe(numItems - 1)
})

it('should update agendas list title', async () => {
  const list = Array.from(
    {length: faker.random.number({min: 2, max: 4})},
    fakeAgenda,
  )
  const items = createEntityList(list)

  const title = faker.random.word()
  const sidebarItems = createEntityList([fakeAgendaList({title, items})])

  const dashboard = fakeCards({
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

  const sidebarId = sidebarItems.ids[0]

  expect(data.template[`sidebarItems.entities.${sidebarId}.title`]).toBe(
    updatedTitle,
  )
})
