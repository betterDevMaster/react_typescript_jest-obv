import React from 'react'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {createEntityList} from 'lib/list'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {emptyActions, render} from '__utils__/render'
import {defaultScore} from 'Event/PointsProvider'
import user from '@testing-library/user-event'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render sidebar config', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      sidebarNav: createEntityList([]),
    }),
  })
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      actions: emptyActions,
      score: defaultScore,
      organization: fakeOrganization(),
    },
  )

  fireEvent.click(await findByLabelText('edit sidebar'))

  const color = '000000'
  user.type(await findByLabelText('background color'), color)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.sidebar.background).toBe(color)
})
