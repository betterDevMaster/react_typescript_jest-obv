import {goToInfusionsoft} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/go-to-infusionsoft'
import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {wait} from '@testing-library/dom'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should redirect to infusionsoft', async () => {
  // Overwrite window.location to check that it was changed
  Object.defineProperty(window, 'location', {
    value: {
      host: `obv.io`,
      href: window.location.href,
    },
  })

  const {findByLabelText} = await goToInfusionsoft({
    userPermissions: [CONFIGURE_EVENTS],
  })

  const url = faker.internet.url()
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        auth_url: url,
      },
    }),
  )

  user.click(await findByLabelText('authorize'))

  await wait(() => {
    expect(global.window.location.href).toBe(url)
  })
})
