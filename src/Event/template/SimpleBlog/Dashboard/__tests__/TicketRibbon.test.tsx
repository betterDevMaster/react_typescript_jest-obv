import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {inputElementFor, render, renderWithEvent} from '__utils__/render'
import {
  ALL_TICKET_RIBBONS,
  TICKET_RIBBON,
} from 'Event/Dashboard/components/TicketRibbon'
import {fireEvent} from '@testing-library/dom'
import {fakeEvent} from 'Event/__utils__/factory'
import StaticEventProvider from 'Event/__utils__/StaticEventProvider'

it('should render ticket ribbons', async () => {
  const dashboard = fakeSimpleBlog({
    ticketRibbon: null,
  })
  const event = fakeEvent({template: dashboard})

  const ticketRibbon = faker.random.arrayElement(ALL_TICKET_RIBBONS)

  const {queryByLabelText, rerender, findByLabelText} = renderWithEvent(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    event,
  )

  const label = `${ticketRibbon.name} ticket`

  expect(queryByLabelText(new RegExp(label))).not.toBeInTheDocument()

  const withTicketRibbon = fakeEvent({
    template: fakeSimpleBlog({
      ticketRibbon: ticketRibbon.name,
    }),
  })

  rerender(<Dashboard isEditMode={false} user={fakeUser()} />, withTicketRibbon)

  expect(await findByLabelText(new RegExp(label))).toBeInTheDocument()
})

it('should configure ticket ribbons', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({ticketRibbon: null}),
  })

  const {findByLabelText} = renderWithEvent(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    event,
  )

  fireEvent.click(await findByLabelText('set ticket ribbon'))

  fireEvent.change(
    inputElementFor(await findByLabelText('pick ticket ribbon')),
    {
      target: {
        value: TICKET_RIBBON.GOLD.name,
      },
    },
  )

  fireEvent.click(await findByLabelText('close config dialog'))

  const label = `${TICKET_RIBBON.GOLD.name} ticket`

  expect(await findByLabelText(new RegExp(label))).toBeInTheDocument()
})
