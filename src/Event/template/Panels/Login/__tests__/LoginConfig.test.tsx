import {fakeEvent} from 'Event/__utils__/factory'
import {goToLoginPageConfig} from 'organization/Event/Page/__utils__/go-to-login-page-config'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import axios from 'axios'
const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure login template', async () => {
  const event = fakeEvent({
    template: fakePanels(),
  })

  const {findByLabelText} = await goToLoginPageConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const textColor = '#e7e7e7'

  user.type(await findByLabelText('submit button color'), textColor)
  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template['login.submitButton.textColor']).toBe(textColor)
})
