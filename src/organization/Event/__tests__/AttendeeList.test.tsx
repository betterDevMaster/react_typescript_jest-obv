import React from 'react'
import faker from 'faker'
import {ObvioEvent} from 'Event'
import {render} from '__utils__/render'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import user from '@testing-library/user-event'
import axios from 'axios'
import App from 'App'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {Attendee} from 'Event/attendee'
import {formatDate, now} from 'lib/date-time'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

it('should show list of attendees', async () => {
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeAttendee,
  )
  const {findByText} = await goToAttendeeList({attendees})

  for (const attendee of attendees) {
    expect(await findByText(attendee.email)).toBeInTheDocument()
  }
})

it('should complete tech check for an attendee', async () => {
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeAttendee,
  )
  const {findAllByLabelText} = await goToAttendeeList({attendees})

  const targetIndex = faker.random.number({min: 0, max: attendees.length - 1})
  const target = attendees[targetIndex]
  const today = now()
  const updated: Attendee = {...target, tech_check_completed_at: today}

  // Not checked in to start
  expect(
    (await findAllByLabelText('date of completing tech check'))[targetIndex]
      .textContent,
  ).toBe('Not Checked-In')

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  // Complete tech check
  user.click(
    (await findAllByLabelText('mark as completed tech check'))[targetIndex],
  )

  // checked-in shows today's date
  expect(
    (await findAllByLabelText('date of completing tech check'))[targetIndex]
      .textContent,
  ).toBe(formatDate(today))
})

async function goToAttendeeList(
  overrides: {event?: ObvioEvent; attendees?: Attendee[]} = {},
) {
  const data = viewEvent(overrides)

  const attendees =
    overrides.attendees ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeAttendee)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendees}))

  const renderResult = render(<App />)

  user.click(await renderResult.findByLabelText(`view ${data.event.name}`))
  user.click(await renderResult.findByLabelText('view attendees'))

  return {...data, ...renderResult}
}

function viewEvent(overrides: {event?: ObvioEvent} = {}) {
  const event = overrides.event || fakeEvent()

  const orgData = signInToOrganization({events: [event]})

  // Fetch target event
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  return {event, ...orgData}
}
