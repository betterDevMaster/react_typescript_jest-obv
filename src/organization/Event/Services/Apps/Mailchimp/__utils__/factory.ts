import {
  ATTENDEE_CHECKED_IN,
  ATTENDEE_SIGNED_WAIVER,
  MailchimpIntegration,
  Tag,
  TagType,
} from 'organization/Event/Services/Apps/Mailchimp'
import faker from 'faker'
import {MAILCHIMP} from 'organization/Event/Services/ServicesProvider'
import {Audience} from 'organization/Event/Services/Apps/Mailchimp/Config/AudienceSelect'
import {Field} from 'organization/Event/Services/Apps/Mailchimp/Config/LoginUrlFieldSelect/LoginUrlFieldSelect'

export const fakeMailchimpIntegration = (
  overrides?: Partial<MailchimpIntegration>,
): MailchimpIntegration => ({
  service: MAILCHIMP,
  has_completed_setup: faker.random.boolean(),
  is_linked: faker.random.boolean(),
  auto_sync_tags_enabled: true,
  audience_id: null,
  login_url_field_id: null,
  access_token_id: null,
  ...overrides,
})

export const tagTypes: TagType[] = [ATTENDEE_CHECKED_IN, ATTENDEE_SIGNED_WAIVER]

export const fakeTag = (overrides?: Partial<Tag>): Tag => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: null,
  type: faker.random.arrayElement(tagTypes),
  ...overrides,
})

export const fakeAudience = (overrides?: Partial<Audience>) => ({
  id: faker.random.alphaNumeric(8),
  name: faker.random.word(),
  ...overrides,
})

export const fakeField = (overrides?: Partial<Field>) => ({
  id: faker.random.alphaNumeric(8),
  name: faker.random.word(),
  ...overrides,
})
