import {fakeEvent} from 'Event/__utils__/factory'
import {goToGeneralConfig} from 'organization/Event/GeneralConfig/__utils__/go-to-general-config'
import user from '@testing-library/user-event'
import faker from 'faker'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'

const mockRxPost = mockRxJsAjax.post as jest.Mock

it('should configure login template', async () => {
  const event = fakeEvent()
  const {findByLabelText} = await goToGeneralConfig({event})
  const backgroundColor = faker.commerce.color()

  user.type(
    await findByLabelText('submit button background color'),
    backgroundColor,
  )

  await wait(() => {
    expect(mockRxPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockRxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template.login.submitButton.backgroundColor).toBe(backgroundColor)
})
