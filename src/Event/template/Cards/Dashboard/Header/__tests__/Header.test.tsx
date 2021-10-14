import React from 'react'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {fakeEvent} from 'Event/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'

afterEach(() => {
  jest.clearAllMocks()
})

it('should render a header', async () => {
  const event = fakeEvent({
    template: fakeCards(),
  })

  const {findByLabelText} = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      waiver: 'somewaiver.pdf',
      tech_check_completed_at: 'now',
    }),
  })

  expect(await findByLabelText('show side menu')).toBeInTheDocument()
})
