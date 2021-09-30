import {fakeAttendee} from 'Event/auth/__utils__/factory'
import axios from 'axios'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent, fakeImageEntry} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createEntityList} from 'lib/list'
import user from '@testing-library/user-event'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'

const mockGet = axios.get as jest.Mock

it('should render image entries', async () => {
  const buttonText = 'image waterfall'

  const {
    findByText,
    findAllByText,
    findAllByLabelText,
    findByLabelText,
  } = await loginToEventSite({
    attendee: fakeAttendee({
      waiver: 'some.pdf',
      tech_check_completed_at: 'now',
      has_password: true,
    }),
    event: fakeEvent({
      template: fakePanels({
        nav: createEntityList([
          fakeNavButtonWithSize({
            page: 'image_waterfall',
            text: buttonText,
          }),
        ]),
      }),
    }),
  })

  const entries = [
    fakeImageEntry({
      title: 'first',
    }),
    fakeImageEntry({
      title: 'second',
    }),
    fakeImageEntry({
      title: 'third',
    }),
  ]

  mockGet.mockImplementationOnce(() => Promise.resolve({data: entries}))

  user.click((await findAllByText(buttonText))[0])

  expect((await findAllByLabelText('entry')).length).toBe(entries.length)

  user.click((await findAllByLabelText('entry'))[0])

  /**
   * Assert lightbox nav works, and indexes are set. Can't actually inspect image as
   * lightbox doesn't expose any labels, but we can verify that things are not
   * broken.
   */

  user.click(await findByLabelText('Previous image'))
  user.click(await findByLabelText('Previous image'))
  user.click(await findByLabelText('Previous image'))
  user.click(await findByLabelText('Previous image'))
  user.click(await findByLabelText('Next image'))
  user.click(await findByLabelText('Next image'))
  user.click(await findByLabelText('Next image'))
  user.click(await findByLabelText('Next image'))
  user.click(await findByLabelText('Next image'))
  user.click(await findByLabelText('Next image'))
})
