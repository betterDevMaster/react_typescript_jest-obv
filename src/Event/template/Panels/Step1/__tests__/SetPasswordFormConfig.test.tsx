import {fakeEvent} from 'Event/__utils__/factory'
import {goToCreatePasswordPageConfig} from 'organization/Event/Page/__utils__/go-to-create-password-page-config'
import user from '@testing-library/user-event'
import faker from 'faker'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'

const mockRxPost = mockRxJsAjax.post as jest.Mock
const mockPut = axios.put as jest.Mock

it('should configure set password form template', async () => {
  const event = fakeEvent({
    template: fakePanels(),
  })

  const {findByLabelText} = await goToCreatePasswordPageConfig({
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

it('should disable requiring a password', async () => {
  const event = fakeEvent({
    requires_attendee_password: true,
    template: fakePanels(),
  })

  const {
    findByLabelText,
    queryByLabelText,
  } = await goToCreatePasswordPageConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  mockPut.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        ...event,
        requires_attendee_password: false,
      },
    }),
  )

  user.click(await findByLabelText('toggle requires attendee password'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.requires_attendee_password).toBe(false)

  // Hiding config if does not require password
  expect(queryByLabelText('confirm password label')).not.toBeInTheDocument()
})
