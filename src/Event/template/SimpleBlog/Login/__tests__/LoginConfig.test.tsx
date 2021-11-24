import {fakeEvent} from 'Event/__utils__/factory'
import {goToLoginPageConfig} from 'organization/Event/Page/__utils__/go-to-login-page-config'
import user from '@testing-library/user-event'
import faker from 'faker'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure login template', async () => {
  const event = fakeEvent()

  const {findByLabelText, findByText} = await goToLoginPageConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  const textColor = faker.commerce.color()

  user.type(await findByLabelText('submit button color'), textColor)

  user.click(await findByText(/save/i))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  expect(data.template['login.submitButton.textColor']).toBe(textColor)
})
