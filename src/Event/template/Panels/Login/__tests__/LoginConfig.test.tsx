import {fakeEvent} from 'Event/__utils__/factory'
import {goToGeneralConfig} from 'organization/Event/GeneralConfig/__utils__/go-to-general-config'
import user from '@testing-library/user-event'
import faker from 'faker'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

it('should configure login template', async () => {
  const event = fakeEvent({
    template: fakePanels(),
  })
  const {findByLabelText} = await goToGeneralConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  const backgroundColor = faker.commerce.color()

  user.type(
    await findByLabelText('submit button background color'),
    backgroundColor,
  )

  mockPut.mockImplementationOnce(() => Promise.resolve({data: event}))

  user.click(await findByLabelText('save general config'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template.login.submitButton.backgroundColor).toBe(backgroundColor)
})
