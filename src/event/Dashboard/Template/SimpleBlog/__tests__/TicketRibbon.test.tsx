import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'event/Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'event/Dashboard'
import {inputElementFor, render} from '__utils__/render'
import {
  ALL_TICKET_RIBBONS,
  TICKET_RIBBON,
} from 'event/Dashboard/components/TicketRibbon'
import {fireEvent} from '@testing-library/dom'
import {fakeEvent} from 'event/__utils__/factory'
import StaticEventProvider from 'event/__utils__/StaticEventProvider'

it('should render ticket ribbons', async () => {
  const dashboard = fakeSimpleBlog({
    ticketRibbon: null,
  })

  const ticketRibbon = faker.random.arrayElement(ALL_TICKET_RIBBONS)

  const {queryByLabelText, rerender, findByLabelText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  const label = `${ticketRibbon.name} ticket`

  expect(queryByLabelText(new RegExp(label))).not.toBeInTheDocument()

  const withTicketRibbon = fakeSimpleBlog({
    ticketRibbon: ticketRibbon.name,
  })

  rerender(
    <Dashboard
      isEditMode={false}
      dashboard={withTicketRibbon}
      user={fakeUser()}
    />,
  )

  expect(await findByLabelText(new RegExp(label))).toBeInTheDocument()
})

it('should configure ticket ribbons', async () => {
  const event = fakeEvent()

  const {findByLabelText} = render(
    <StaticEventProvider event={event}>
      <Dashboard
        isEditMode={true}
        dashboard={fakeSimpleBlog({ticketRibbon: null})}
        user={fakeUser()}
      />
    </StaticEventProvider>,
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
