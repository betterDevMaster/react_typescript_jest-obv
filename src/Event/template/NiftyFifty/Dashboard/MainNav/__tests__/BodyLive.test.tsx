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

  const {queryByLabelText, findAllByTestId} = await loginToEventSite({
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

  const firstButton = (await findAllByTestId('main nav button container'))[0]

  // is on first page
  expect(queryByLabelText('show prev buttons')).not.toBeInTheDocument()

  // is on next page (first button hidden)
  expect(firstButton).toHaveStyle('display: block;')
})
