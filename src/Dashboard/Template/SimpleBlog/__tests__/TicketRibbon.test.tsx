import React from 'react'
import faker from 'faker'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import Dashboard from 'Dashboard'
import {render} from '__utils__/render'
import {ALL_TICKET_RIBBONS} from 'Dashboard/components/TicketRibbon'
import {fireEvent} from '@testing-library/dom'

it('should render ticket ribbons', () => {
  const dashboard = fakeSimpleBlog({
    ticketRibbon: null,
  })

  const ticketRibbon = faker.random.arrayElement(ALL_TICKET_RIBBONS)

  const {queryByLabelText, rerender} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  const label = `${ticketRibbon.name} ticket`

  expect(queryByLabelText(new RegExp(label))).not.toBeInTheDocument()

  const withTicketRibbon = fakeSimpleBlog({
    ticketRibbon,
  })

  rerender(
    <Dashboard
      isEditMode={false}
      dashboard={withTicketRibbon}
      user={fakeUser()}
    />,
  )

  expect(queryByLabelText(new RegExp(label))).toBeInTheDocument()
})

it('should configure ticket ribbons', async () => {
  const {findByLabelText} = render(
    <Dashboard
      isEditMode={true}
      dashboard={fakeSimpleBlog({ticketRibbon: null})}
      user={fakeUser()}
    />,
  )

  fireEvent.click(await findByLabelText('set ticket ribbon'))
})
