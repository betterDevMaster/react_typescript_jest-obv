import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {clickEdit} from '__utils__/edit'
import {fireEvent, wait} from '@testing-library/react'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('it should show network error', async () => {
  const event = fakeEvent({template: fakePanels(), header_background: null})
  const {findByLabelText, findByText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('welcome'))

  fireEvent.change(await findByLabelText('welcome text'), {
    target: {
      value: 'some value',
    },
  })

  mockPut.mockImplementationOnce(() =>
    Promise.reject({
      response: {
        data: 'bad save',
      },
    }),
  )

  user.click(await findByLabelText('save welcome text'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(/network connection error/i)).toBeInTheDocument()
})
