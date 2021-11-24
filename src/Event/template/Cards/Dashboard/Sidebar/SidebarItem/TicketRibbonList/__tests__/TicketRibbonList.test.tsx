import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {inputElementFor} from '__utils__/render'
import {
  BLACK_RIBBON,
  RIBBONS,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'
import {fireEvent} from '@testing-library/dom'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeTicketRibbon} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/__utils__/factory'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {clickEdit} from '__utils__/edit'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {createTicketRibbonList} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList'
import axios from 'axios'
import {createEntityList} from 'lib/list'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should add a ticket ribbon list', async () => {
  const event = fakeEvent({
    template: fakeCards(),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/add item/i))
  fireEvent.mouseDown(await findByLabelText('select sidebar item'))
  fireEvent.click(await findByText(/ticket ribbons/i))
  fireEvent.click(await findByLabelText('add item'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(/remove ribbons/i)).toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const id = data.template['sidebarItems.ids'][0]
  expect(data.template[`sidebarItems.entities.${id}.type`]).toBe(
    'Ticket Ribbon List',
  )
})

it('should remove a ticket ribbon list', async () => {
  const sidebarItems = createEntityList([createTicketRibbonList()])

  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })
  const {queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  fireEvent.click(await findByText(/remove ribbons/i))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(queryByText(/remove ribbons/i)).not.toBeInTheDocument()

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template['sidebarItems.ids'].length).toBe(0)
})

it('should edit an existing ticket ribbon', async () => {
  const ticketRibbons = Array.from(
    {length: faker.random.number({min: 2, max: 5})},
    fakeTicketRibbon,
  )
  const ribbons = createEntityList(ticketRibbons)

  const sidebarItems = createEntityList([
    {
      ...createTicketRibbonList(),
      ribbons,
    },
  ])
  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })

  const {findByLabelText, findAllByLabelText} = await goToDashboardConfig({
    event,
  })

  const targetIndex = faker.random.number({
    min: 0,
    max: ticketRibbons.length - 1,
  })

  // Renders same values as data
  expect(
    (await findAllByLabelText('ticket ribbon text'))[targetIndex].textContent,
  ).toBe(ticketRibbons[targetIndex].text)

  clickEdit((await findAllByLabelText('ticket ribbon'))[targetIndex])

  const ribbon = faker.random.arrayElement(RIBBONS)

  fireEvent.change(
    inputElementFor(await findByLabelText('pick ticket ribbon')),
    {
      target: {
        value: ribbon,
      },
    },
  )

  fireEvent.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const sidebarId = sidebarItems.ids[0]
  const ribbonId = ribbons.ids[targetIndex]

  expect(
    data.template[
      `sidebarItems.entities.${sidebarId}.ribbons.entities.${ribbonId}.name`
    ],
  ).toBe(ribbon)
})

it('should add a new ticket ribbon', async () => {
  const sidebarItems = createEntityList([
    {
      ...createTicketRibbonList(),
      ribbons: createEntityList([]),
    },
  ])
  const withoutRibbons = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({
    event: withoutRibbons,
  })

  fireEvent.click(await findByLabelText('add ticket ribbon'))

  fireEvent.change(
    inputElementFor(await findByLabelText('pick ticket ribbon')),
    {
      target: {
        value: BLACK_RIBBON,
      },
    },
  )

  const text = 'vip'

  user.type(await findByLabelText('ticket ribbon text input'), text)

  fireEvent.click(await findByLabelText('save'))

  expect(await findByLabelText('ticket ribbon')).toBeInTheDocument()
  expect(await findByText(new RegExp(text))).toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${withoutRibbons.slug}/template`)

  const sidebarId = sidebarItems.ids[0]

  const ribbonId =
    data.template[`sidebarItems.entities.${sidebarId}.ribbons.ids`][0]

  expect(
    data.template[
      `sidebarItems.entities.${sidebarId}.ribbons.entities.${ribbonId}.text`
    ],
  ).toBe(text)
})

it('should remove a ticket ribbon', async () => {
  const numRibbons = faker.random.number({min: 2, max: 5})

  const ticketRibbons = Array.from({length: numRibbons}, fakeTicketRibbon)
  const ribbons = createEntityList(ticketRibbons)

  const sidebarItems = createEntityList([
    {
      ...createTicketRibbonList(),
      ribbons,
    },
  ])

  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })

  const {
    findByLabelText,
    findAllByLabelText,
    queryByText,
  } = await goToDashboardConfig({
    event,
  })

  const targetIndex = faker.random.number({
    min: 0,
    max: ticketRibbons.length - 1,
  })

  // Renders same values as data
  expect(
    (await findAllByLabelText('ticket ribbon text'))[targetIndex].textContent,
  ).toBe(ticketRibbons[targetIndex].text)

  clickEdit((await findAllByLabelText('ticket ribbon'))[targetIndex])

  fireEvent.click(await findByLabelText('remove ticket ribbon'))

  // Target ribbon removed
  expect(queryByText(ticketRibbons[targetIndex].text)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const sidebarId = sidebarItems.ids[0]

  expect(
    data.template[`sidebarItems.entities.${sidebarId}.ribbons.ids`].length,
  ).toBe(numRibbons - 1)
})
