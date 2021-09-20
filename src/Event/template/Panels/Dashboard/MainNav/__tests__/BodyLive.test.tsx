import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createEntityList} from 'lib/list'
import {act} from 'react-dom/test-utils'
import user from '@testing-library/user-event'

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
    template: fakePanels({
      nav: createEntityList(buttons),
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

  const firstButton = (await findAllByTestId('main nav button container'))[0]

  // is on first page
  expect(queryByLabelText('show prev buttons')).not.toBeInTheDocument()

  // go next page
  user.click(await findByLabelText('show next buttons'))

  // is on next page (first button hidden)
  expect(firstButton).toHaveStyle('display: none;')

  // Go back
  user.click(await findByLabelText('show prev buttons'))

  // is showing first button again
  expect(firstButton).not.toHaveStyle('display: none;')
})
