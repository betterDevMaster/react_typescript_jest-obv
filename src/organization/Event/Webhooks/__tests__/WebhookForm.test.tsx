import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import axios from 'axios'
import {act} from 'react-dom/test-utils'
import {goToWebhooks} from 'organization/Event/Webhooks/__utils__/go-to-webhooks'
import {fakeAccessToken} from 'organization/Event/Services/AccessTokens/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeWebhook} from 'organization/Event/Webhooks/__utils__/factory'

const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

// it('should have all disabled webhook form fields when missing access token', async () => {
//   const {findByLabelText} = await goToWebhooks()

//   // expect(await findByLabelText('webhook event')).toBeDisabled()
//   expect(await findByLabelText('webhook url')).toBeDisabled()
//   expect(await findByLabelText('toggle webhook crc enabled')).toBeDisabled()
//   expect(await findByLabelText('save webhook')).toBeDisabled()
// })

it('should generate crc when toggled', async () => {
  const accessToken = fakeAccessToken()
  const event = fakeEvent({
    has_webhook_crc_salt: false,
    webhook_access_token_id: accessToken.id,
  })

  const {event: eventX, findByLabelText} = await goToWebhooks({
    event,
    access_tokens: [accessToken],
  })

  expect(await findByLabelText('webhook crc salt indicator')).not.toBeChecked()

  const salt = 'somerandomsalt'

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        webhook_salt: salt,
      },
    }),
  )

  user.click(await findByLabelText('toggle webhook crc enabled'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${eventX.slug}/webhooks/salt`)
  expect(await findByLabelText('webhook crc salt indicator')).toBeChecked()
})

it('should not generate crc when toggled', async () => {
  const accessToken = fakeAccessToken()
  const event = fakeEvent({
    has_webhook_crc_salt: true,
    webhook_access_token_id: accessToken.id,
  })

  const {findByLabelText} = await goToWebhooks({
    event,
    access_tokens: [accessToken],
  })

  expect(await findByLabelText('webhook crc salt indicator')).toBeChecked()

  await act(async () => {
    user.click(await findByLabelText('toggle webhook crc enabled'))
  })

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(0)
  })
})

it('should add a webhook', async () => {
  const accessToken = fakeAccessToken()
  const obvioEvent = fakeEvent({
    webhook_access_token_id: accessToken.id,
  })

  const {event, findByLabelText, findByText} = await goToWebhooks({
    event: obvioEvent,
    access_tokens: [accessToken],
  })

  fireEvent.mouseDown(await findByLabelText('webhook event'))
  user.click(await findByLabelText('webhook event attendee.checked_in'))

  const webhookUrl = 'https://myapp.obv.io'
  user.type(await findByLabelText('webhook url'), webhookUrl)

  const newWebhook = fakeWebhook({
    url: webhookUrl,
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: newWebhook}))

  await act(async () => {
    user.click(await findByLabelText('save webhook'))
  })

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [reqUrl, data] = mockPost.mock.calls[0]
  expect(reqUrl).toMatch(`/events/${event.slug}/webhooks`)

  expect(await findByLabelText('save webhook')).not.toBeDisabled()

  expect(data.url).toBe(webhookUrl)
  expect(data.webhook_event).toBe('attendee.checked_in')

  // is showing new webhook in list
  expect(await findByText(webhookUrl)).toBeInTheDocument()
})
