import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'
import axios from 'axios'
import {act} from 'react-dom/test-utils'
import {
  fakeWebhook,
  fakeWebhookTestResponseData,
} from 'organization/Event/Webhooks/__utils__/factory'
import {goToWebhooks} from 'organization/Event/Webhooks/__utils__/go-to-webhooks'

const mockDelete = axios.delete as jest.Mock
const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

Object.assign(navigator, {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
})

it('should list webhooks', async () => {
  const webhook = fakeWebhook({
    url: 'https://www.gyzm.com',
    requires_crc: true,
  })

  const {findByLabelText, findAllByLabelText} = await goToWebhooks({
    webhooks: [webhook],
  })

  expect(
    await findByLabelText(`webhook list row ${webhook.id}`),
  ).toBeInTheDocument()
  expect((await findAllByLabelText(/webhook list row/)).length).toBe(1)

  expect(
    await findByLabelText(`webhook ${webhook.id} event`),
  ).toHaveTextContent(webhook.webhook_event)
  const webhookUrl = webhook.url || ''
  expect(await findByLabelText(`webhook ${webhook.id} url`)).toHaveTextContent(
    webhookUrl,
  )
  expect(
    await findByLabelText(`webhook ${webhook.id} requires_crc`),
  ).toBeChecked()
  expect(
    await findByLabelText(`webhook ${webhook.id} test`),
  ).toBeInTheDocument()
  expect(
    await findByLabelText(`webhook ${webhook.id} remove`),
  ).toBeInTheDocument()
})

it('should test a webhook', async () => {
  const webhook = fakeWebhook({
    url: 'https://www.gyzm.com',
    requires_crc: true,
  })

  const {findByLabelText, findByText} = await goToWebhooks({
    webhooks: [webhook],
  })

  const testResponseText = 'looks good from here.'

  const response = fakeWebhookTestResponseData({
    destination: webhook,
    response: testResponseText,
  })

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: response,
    }),
  )

  await act(async () => {
    user.click(await findByLabelText(`webhook ${webhook.id} test`))
  })

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url] = mockPost.mock.calls[0]
  expect(url).toMatch(`/webhooks/${webhook.id}/test`)

  expect(await findByLabelText(`webhook ${webhook.id} test`)).not.toBeDisabled()

  // Assert overlay showing response
  expect(await findByText(new RegExp(testResponseText))).toBeInTheDocument()
})

it('should remove a webhook', async () => {
  const webhook = fakeWebhook({
    url: 'https://www.gyzm.com',
    requires_crc: true,
  })
  const secondWebhook = fakeWebhook()

  const {findByLabelText, findAllByLabelText} = await goToWebhooks({
    webhooks: [webhook, secondWebhook],
  })

  expect((await findAllByLabelText(/webhook list row/)).length).toBe(2)

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  await act(async () => {
    user.click(await findByLabelText(`webhook ${webhook.id} remove`))
  })

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  const [url] = mockDelete.mock.calls[0]
  expect(url).toMatch(`/webhooks/${webhook.id}`)

  expect((await findAllByLabelText(/webhook list row/)).length).toBe(1)
})
