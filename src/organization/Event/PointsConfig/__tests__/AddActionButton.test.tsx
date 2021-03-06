import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {wait} from '@testing-library/react'
import {goToPointsConfig} from 'organization/Event/PointsConfig/__utils__/go-to-points-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPost = axios.post as jest.Mock

it('should add a new action', async () => {
  const {findByLabelText, findAllByLabelText, actions} = await goToPointsConfig(
    {
      userPermissions: [CONFIGURE_EVENTS],
    },
  )

  const added = fakeAction()

  mockPost.mockImplementationOnce(() => Promise.resolve({data: added}))
  user.click(await findByLabelText('add action'))

  await wait(async () => {
    expect((await findAllByLabelText('action')).length).toBe(actions.length + 1)
  })
})
