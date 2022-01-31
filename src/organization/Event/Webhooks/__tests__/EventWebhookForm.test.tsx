import faker from 'faker'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import axios from 'axios'
import {act} from 'react-dom/test-utils'
import {fakeWebhook} from 'organization/Event/Webhooks/__utils__/factory'
import {goToWebhooks} from 'organization/Event/Webhooks/__utils__/go-to-webhooks'
import {fakeAccessToken} from 'organization/Event/Services/AccessTokens/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'

const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

Object.assign(navigator, {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
})

it('should show webhook event form webhook form webhook list', async () => {
  const {findByLabelText, findAllByLabelText} = await goToWebhooks({
    webhooks: [fakeWebhook()],
  })

  expect(await findByLabelText('webhook event url')).toBeInTheDocument()
  expect(await findByLabelText('webhook event')).toBeInTheDocument()
  expect(await findByLabelText('webhook crc salt indicator')).not.toBeChecked()
  expect(await findByLabelText('webhook event')).toBeInTheDocument()
  expect(await findByLabelText('webhook url')).toBeInTheDocument()
  expect(
    await findByLabelText('toggle webhook crc enabled'),
  ).toBeInTheDocument()
  expect((await findAllByLabelText(/webhook list row/)).length).toBe(1)
})

it('should update event webhook fields', async () => {
  const accessToken = fakeAccessToken()

  const {event, findByLabelText, findByText} = await goToWebhooks({
    access_tokens: [accessToken],
  })

  const eventWebhookUrl = faker.internet.url()
  user.type(await findByLabelText('webhook event url'), eventWebhookUrl)

  user.click(await findByLabelText('webhook access token selector'))

  user.click(await findByText(accessToken.value))

  user.click(await findByLabelText('save webhook event'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  expect(await findByLabelText('save webhook event')).not.toBeDisabled()

  expect(data.webhook_url).toBe(eventWebhookUrl)
  expect(data.webhook_access_token_id).toBe(accessToken.id)
})

it('should copy the selected access token to clipboard', async () => {
  const accessToken = fakeAccessToken()

  const {findByLabelText, findByText} = await goToWebhooks({
    access_tokens: [accessToken],
  })

  user.click(await findByLabelText('webhook access token selector'))

  user.click(await findByText(accessToken.value))

  jest.spyOn(navigator.clipboard, 'writeText')
  user.click(await findByLabelText('copy access token'))
  await wait(() => {
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      accessToken.value,
    )
  })
})

it('should indicated no crc salt', async () => {
  const {findByLabelText} = await goToWebhooks()

  expect(await findByLabelText('webhook crc salt indicator')).not.toBeChecked()
})

it('should indicate crc salt', async () => {
  const event = fakeEvent({has_webhook_crc_salt: true})

  const {findByLabelText} = await goToWebhooks({
    event,
  })

  expect(await findByLabelText('webhook crc salt indicator')).toBeChecked()
})

it('should generate a new crc salt', async () => {
  const {event, findByLabelText, findByText} = await goToWebhooks()

  expect(await findByLabelText('webhook crc salt indicator')).not.toBeChecked()

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {webhook_salt: 'fakesalt'}}),
  )

  await act(async () => {
    user.click(await findByLabelText('generate salt'))
  })

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/webhooks/salt`)

  expect(await findByLabelText('generate salt')).not.toBeDisabled()
  expect(await findByLabelText('webhook crc salt indicator')).toBeChecked()
  expect(await findByText('Re-Generate CRC Salt')).toBeInTheDocument()
  expect(await findByText('Event has a CRC salt generated')).toBeInTheDocument()

  // Is showing salt overlay
  expect(
    await findByText(
      'If you lose this value, you will need to re-generate a new CRC salt.',
    ),
  ).toBeInTheDocument()
})
