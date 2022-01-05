import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {fakeNiftyFifty} from 'Event/template/NiftyFifty/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createHashMap} from 'lib/list'
import {act} from 'react-dom/test-utils'
import user from '@testing-library/user-event'
import {hideConsoleErrors} from 'setupTests'

hideConsoleErrors()

it('should paginate buttons', async () => {
  const buttons = Array.from(
    {
      length: 20,
    },

    (_, index) =>
      fakeNavButtonWithSize({
        text: `${index + 1}`,
      }),
  )

  const event = fakeEvent({
    template: fakeNiftyFifty({
      nav: createHashMap(buttons),
    }),
  })

  const {
    queryByLabelText,
    findAllByTestId,
    findByLabelText,
  } = await loginToEventSite({
    event,
    attendee: fakeAttendee({
      tech_check_completed_at: 'now',
      waiver: 'some_waiver.png',
    }),
  })

  /**
   * Resize to some narrow height
   */
  act(() => {
    global.innerHeight = 500
    global.dispatchEvent(new Event('resize'))
  })
})
