import {fakeEvent} from 'Event/__utils__/factory'
import {goToGeneralConfig} from 'organization/Event/GeneralConfig/__utils__/go-to-general-config'
import user from '@testing-library/user-event'
import faker from 'faker'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'

const mockRxPost = mockRxJsAjax.post as jest.Mock

it('should configure set password form template', async () => {
  const event = fakeEvent({
    template: fakePanels(),
  })
  const {findByLabelText} = await goToGeneralConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const description = faker.lorem.sentence()

  user.type(await findByLabelText('set password form description'), description)

  await wait(() => {
    expect(mockRxPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockRxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template.setPasswordForm.description).toBe(description)
})
