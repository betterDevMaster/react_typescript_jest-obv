import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fakeEvent} from 'Event/__utils__/factory'
import {fireEvent, wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import {rgba} from 'lib/color'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render fiftyblog left panel', async () => {
  const {findByLabelText, queryByText} = await goToDashboardConfig({
    event: fakeEvent({template: fakeFiftyBlog(), logo: null}),
  })

  expect(await findByLabelText('fiftyblog left panel')).toBeInTheDocument()
  expect(
    queryByText('fiftyblog left panel menu Home button'),
  ).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('menu icon button'))

  expect(
    await findByLabelText('fiftyblog left panel menu Home button'),
  ).toBeInTheDocument()
  expect(
    await findByLabelText('fiftyblog left panel menu Speakers button'),
  ).toBeInTheDocument()
  expect(
    await findByLabelText('fiftyblog left panel menu Resources button'),
  ).toBeInTheDocument()
  expect(
    await findByLabelText('fiftyblog left panel menu Points button'),
  ).toBeInTheDocument()
})

it('should render fiftyblog left panel', async () => {
  const event = fakeEvent({template: fakeFiftyBlog(), logo: null})

  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('fiftyblog left panel'))

  const color = '#666666'
  user.type(await findByLabelText('fiftyblog left panel bar text color'), color)

  user.click(await findByLabelText('save'))

  await wait(async () => {
    expect(mockPut).toHaveBeenCalledTimes(1)
    // expect(await findByLabelText('fiftyblog left panel bar text color')).toHaveStyle(
    //   `background-color: ${rgba(color)}`,
    // )
  })

  const [url] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)
})
