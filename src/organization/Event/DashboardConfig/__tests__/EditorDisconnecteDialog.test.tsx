import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {clickEdit} from '__utils__/edit'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {fireEvent, wait} from '@testing-library/react'
import {Subject} from 'rxjs'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('it should show network error', async () => {
  const event = fakeEvent({template: fakePanels(), header_background: null})
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('welcome'))

  /**
   * Need to mock the subject to manually emit an error.
   */
  const subject = new Subject()

  mockPost.mockImplementationOnce(() => {
    return subject
  })

  fireEvent.change(await findByLabelText('welcome text'), {
    target: {
      value: 'some value',
    },
  })

  subject.error('bad save')

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(/network connection error/i)).toBeInTheDocument()
})
