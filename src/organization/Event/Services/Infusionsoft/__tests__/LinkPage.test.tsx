import {goToInfusionsoft} from 'organization/Event/Services/Infusionsoft/__utils__/go-to-infusionsoft'
import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {wait} from '@testing-library/dom'

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

  const {findByLabelText} = await goToInfusionsoft()

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
