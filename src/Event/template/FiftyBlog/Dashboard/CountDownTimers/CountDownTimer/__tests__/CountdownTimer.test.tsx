import {fakeCountDownTimer} from 'Event/Dashboard/components/CountDownTimer/__utils__/factory'
import {createHashMap} from 'lib/list'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import moment from 'moment'
import {wait} from '@testing-library/dom'
import {loginToFiftyBlogSite} from 'Event/template/FiftyBlog/__utils__/login-to-fifty-blog-site'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show timer for attendee', async () => {
  const timer = fakeCountDownTimer({
    end: moment().add(1, 'day').toISOString(),
    enabled: true,
  })

  const {findByLabelText} = await loginToFiftyBlogSite({
    event: fakeEvent({
      template: fakeFiftyBlog({
        countDownTimers: createHashMap([timer]),
      }),
    }),
    attendee: fakeAttendee({
      waiver: 'waiver.png',
      tech_check_completed_at: 'now',
      has_password: true,
    }),
  })

  expect(await findByLabelText('count down timer')).toBeInTheDocument()
})

it('should hide timer if past', async () => {
  const timer = fakeCountDownTimer({
    end: moment().add(2, 'seconds').toISOString(),
    enabled: true,
  })

  const {queryByLabelText} = await loginToFiftyBlogSite({
    event: fakeEvent({
      template: fakeFiftyBlog({
        countDownTimers: createHashMap([timer]),
      }),
    }),
    attendee: fakeAttendee({
      waiver: 'waiver.png',
      tech_check_completed_at: 'now',
      has_password: true,
    }),
  })

  await wait(() => {
    expect(queryByLabelText('count down timer')).not.toBeInTheDocument()
  })
})
