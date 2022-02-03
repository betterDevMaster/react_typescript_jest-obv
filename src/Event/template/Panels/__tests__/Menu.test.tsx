import {loginToEventSite} from 'Event/__utils__/url'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'

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
