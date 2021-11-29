import {fakeAttendee} from 'Event/auth/__utils__/factory'
import axios from 'axios'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeEvent, fakeImageEntry} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createHashMap} from 'lib/list'
import user from '@testing-library/user-event'
import {fakeCardsNavButton} from 'Event/template/Cards/Dashboard/CardsNavButton/__utils__/factory'

const mockGet = axios.get as jest.Mock

it('should render image entries', async () => {
  const {
    findByText,
    findAllByLabelText,
    findByLabelText,
  } = await loginToEventSite({
    attendee: fakeAttendee({
      waiver: 'some.pdf',
      tech_check_completed_at: 'now',
      has_password: true,
    }),
    event: fakeEvent({
      template: fakeCards({
        mainNav: {
          buttons: createHashMap([
            fakeCardsNavButton({
              page: '/image_waterfall',
              text: 'image waterfall page',
            }),
          ]),
        },
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

  user.click(await findByText('image waterfall page'))

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
