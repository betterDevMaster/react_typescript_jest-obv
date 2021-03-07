import React from 'react'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {fakeEvent} from 'Event/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider/__utils__/StaticPointsProvider'

afterEach(() => {
  jest.clearAllMocks()
})

it('should render a header', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog(),
  })

  const {findByLabelText} = render(
    <Dashboard isEditMode={false} user={fakeUser()} />,
    {
      event: event,
      score: defaultScore,
      actions: emptyActions,
      withRouter: true,
    },
  )
  expect(await findByLabelText('show side menu')).toBeInTheDocument()
})
