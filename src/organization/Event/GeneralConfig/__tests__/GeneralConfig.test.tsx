import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {goToGeneralConfig} from 'organization/Event/GeneralConfig/__utils__/go-to-general-config'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'

const mockPost = mockRxJsAjax.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show select template form', async () => {
  const event = fakeEvent({template: null})
  const {findByLabelText} = await goToGeneralConfig({event})
  expect(await findByLabelText('template select')).toBeInTheDocument()
})

it('should update progress bar color', async () => {
  const event = fakeEvent()
  const {findByLabelText} = await goToGeneralConfig({event})

  const color = '#e7e7e7'
  user.type(await findByLabelText('bar color'), color)

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.progressBar.barColor).toBe(color)
})
