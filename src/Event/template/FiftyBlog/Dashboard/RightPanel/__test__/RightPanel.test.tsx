import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {rgba} from 'lib/color'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'
import {DeepRequired} from 'lib/type-utils'
import {FiftyBlog} from 'Event/template/FiftyBlog'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render right panel', async () => {
  const event = fakeEvent({template: fakeFiftyBlog(), logo: null})
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  expect(await findByLabelText('panels tab home')).toBeInTheDocument()
  expect(await findByLabelText('panels tab speakers')).toBeInTheDocument()
  expect(await findByLabelText('panels tab sponsors')).toBeInTheDocument()
  expect(await findByLabelText('panels tab resources')).toBeInTheDocument()
  expect(await findByLabelText('panels tab points')).toBeInTheDocument()
  // expect(
  //   await findByLabelText('panels tab image water fall'),
  // ).toBeInTheDocument()
  // expect(await findByLabelText('panels tab faqs')).toBeInTheDocument()
})

it('should configure right panel', async () => {
  const event = fakeEvent({template: fakeFiftyBlog(), logo: null})

  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('panels right panel bar'))

  const color = '#555555'
  user.type(await findByLabelText('bar text color'), color)

  user.click(await findByLabelText('save'))

  await wait(async () => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(await findByLabelText('panels tab home')).toHaveStyle(
    `color: ${rgba(color)}`,
  )

  const [url] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
})
