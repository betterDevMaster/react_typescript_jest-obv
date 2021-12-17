import faker from 'faker'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'
import {fireEvent} from '@testing-library/dom'
import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {fakeTicketRibbon} from 'Event/template/FiftyBlog/Dashboard/TicketRibbonList/__utils__/factory'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should edit an existing ticket ribbon', async () => {
  const ticketRibbons = [
    fakeTicketRibbon({
      letter: 'A',
    }),
    fakeTicketRibbon({
      letter: 'B',
    }),
    fakeTicketRibbon({
      letter: 'C',
    }),
  ]

  const event = fakeEvent({
    template: fakeFiftyBlog({
      ticketRibbons,
    }),
  })

  const {findByLabelText, findByText, queryByText} = await goToDashboardConfig({
    event,
  })

  user.click(await findByText('B'))

  fireEvent.change(await findByLabelText('letter input'), {
    target: {
      value: 'V',
    },
  })

  fireEvent.click(await findByText(/save/i))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  expect(data.template.ticketRibbons[1].letter).toBe('V')

  expect(queryByText('B')).not.toBeInTheDocument()
})

it('should add a new ticket ribbon', async () => {
  const withoutRibbons = fakeEvent({
    template: fakeFiftyBlog({
      ticketRibbons: [], // start with no ribbons
    }),
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({
    event: withoutRibbons,
  })

  fireEvent.click(await findByLabelText('add ticket ribbon'))

  const letter = 'V'
  user.type(await findByLabelText('letter input'), letter)

  fireEvent.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${withoutRibbons.slug}/template`)
  expect(data.template['ticketRibbons'].length).toBe(1)

  expect(await findByText(letter)).toBeInTheDocument()
})

it('should remove a ticket ribbon', async () => {
  const ticketRibbons = [
    fakeTicketRibbon({
      letter: 'A',
    }),
    fakeTicketRibbon({
      letter: 'B',
    }),
    fakeTicketRibbon({
      letter: 'C',
    }),
  ]

  const event = fakeEvent({
    template: fakeFiftyBlog({
      ticketRibbons,
    }),
  })

  const {findByText, queryByText} = await goToDashboardConfig({
    event,
  })

  const targetIndex = faker.random.number({
    min: 0,
    max: ticketRibbons.length - 1,
  })

  const target = ticketRibbons[targetIndex]

  user.click(await findByText(target.letter))

  fireEvent.click(await findByText(/remove/i))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
  // one less ribbon saved
  expect(data.template['ticketRibbons'].length).toBe(ticketRibbons.length - 1)

  // Target ribbon was removed
  expect(queryByText(target.letter)).not.toBeInTheDocument()
})
