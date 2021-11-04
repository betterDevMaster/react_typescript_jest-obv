import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {rgba} from 'lib/color'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render right panel', async () => {
  const event = fakeEvent({template: fakePanels(), logo: null})
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  expect(await findByLabelText('panels tab home')).toBeInTheDocument()
  expect(await findByLabelText('panels tab speakers')).toBeInTheDocument()
  expect(await findByLabelText('panels tab sponsors')).toBeInTheDocument()
  expect(await findByLabelText('panels tab resources')).toBeInTheDocument()
  expect(await findByLabelText('panels tab points')).toBeInTheDocument()
  expect(
    await findByLabelText('panels tab image water fall'),
  ).toBeInTheDocument()
  expect(await findByLabelText('panels tab faqs')).toBeInTheDocument()
})

it('should render right panel', async () => {
  const event = fakeEvent({template: fakePanels(), logo: null})

  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('panels right panel bar'))

  const color = '#555555'
  user.type(await findByLabelText('bar text color'), color)

  await wait(async () => {
    expect(await findByLabelText('panels tab home')).toHaveStyle(
      `color: ${rgba(color)}`,
    )
  })
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)
})
