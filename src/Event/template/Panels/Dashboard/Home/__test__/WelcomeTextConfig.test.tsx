import React from 'react'
import user from '@testing-library/user-event'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {render} from '__utils__/render'
import {fakeEvent} from 'Event/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import {clickEdit} from '__utils__/edit'

afterEach(() => {
  jest.clearAllMocks()
})

const mockPost = axios.post as jest.Mock

it('should update welcome Text', async () => {
  const event = fakeEvent({template: fakePanels(), header_background: null})
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      withRouter: true,
      score: defaultScore,
      actions: [],
      organization: fakeOrganization(),
    },
  )

  clickEdit(await findByLabelText('welcome'))

  const welcomeText = faker.random.words(2)

  user.type(await findByLabelText('welcome text'), welcomeText)

  expect((await findByLabelText('welcome')).textContent).toBe(welcomeText)

//   await wait(() => {
//     expect(mockPost).toHaveBeenCalledTimes(1)
//   })

//   const [url, data] = mockPost.mock.calls[0]

//   expect(url).toMatch(`/events/${event.slug}`)
//   expect(data.get('welcomeText')).toBe(welcomeText)
})
