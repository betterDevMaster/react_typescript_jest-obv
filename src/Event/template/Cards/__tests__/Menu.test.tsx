import {loginToEventSite} from 'Event/__utils__/url'
import user from '@testing-library/user-event'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {EVENT_TOKEN_KEY} from 'Event/auth'
import {fakeEvent} from 'Event/__utils__/factory'

it('should logout a user', async () => {
  const {findByLabelText} = await loginToEventSite({
    attendee: fakeAttendee({
      waiver: 'haswaiver.jpg',
      tech_check_completed_at: new Date().toISOString(),
    }),
  })
  expect(window.localStorage.getItem(EVENT_TOKEN_KEY)).not.toBeNull()

  user.click(await findByLabelText('show side menu'))
  user.click(await findByLabelText('logout'))

  // Back to login page
  expect(await findByLabelText('email')).toBeInTheDocument()

  // Token was deleted
  expect(window.localStorage.getItem(EVENT_TOKEN_KEY)).toBeNull()
})

it('should hide change password when password create is disabled', async () => {
  const withoutSetPassword = fakeEvent({
    requires_attendee_password: false,
  })

  const {findByLabelText, queryByLabelText} = await loginToEventSite({
    event: withoutSetPassword,
  })

  user.click(await findByLabelText('show side menu'))

  expect(queryByLabelText('change password')).not.toBeInTheDocument()
})
