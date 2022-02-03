import faker from 'faker'
import {
  Webhook,
  WebhookData,
  WebhookTestResponseData,
} from 'organization/Event/WebhooksProvider'

export const fakeWebhookTestResponseData = (
  overrides?: Partial<WebhookTestResponseData>,
): WebhookTestResponseData => ({
  headers: overrides?.headers || [],
  destination: overrides?.destination || fakeWebhook(),
  payload: overrides?.payload || {},
  response: overrides?.response || '',
})

export const fakeWebhookData = (
  overrides?: Partial<WebhookData>,
): WebhookData => ({
  has_webhook_crc_salt: overrides?.has_webhook_crc_salt || false,
  webhook_access_token_id: overrides?.webhook_access_token_id || null,
  webhook_url: overrides?.webhook_url || null,
})

export const fakeWebhook = (overrides?: Partial<Webhook>): Webhook => ({
  id: faker.random.number({min: 1000, max: 10000}),
  event_id: overrides?.event_id || faker.random.number({min: 1000, max: 10000}),
  webhook_event: overrides?.webhook_event || 'attendee.checked_in',
  url: overrides?.url || faker.internet.url(),
  requires_crc: overrides?.requires_crc || false,
})
