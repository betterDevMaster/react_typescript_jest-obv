import {
  ATTENDEE_CREATED,
  ATTENDEE_CHECKED_IN,
  ATTENDEE_SIGNED_WAIVER,
  InfusionsoftIntegration,
  Tag,
  TagType,
} from 'organization/Event/Services/Apps/Infusionsoft'
import faker from 'faker'
import {INFUSIONSOFT} from 'organization/Event/Services/ServicesProvider'

export const fakeInfusionsoftIntegration = (
  overrides?: Partial<InfusionsoftIntegration>,
): InfusionsoftIntegration => ({
  service: INFUSIONSOFT,
  has_completed_setup: faker.random.boolean(),
  is_linked: faker.random.boolean(),
  login_field_id: null,
  login_field_label: null,
  ...overrides,
})

export const tagTypes: TagType[] = [
  ATTENDEE_CREATED,
  ATTENDEE_CHECKED_IN,
  ATTENDEE_SIGNED_WAIVER,
]

export const fakeTag = (overrides?: Partial<Tag>): Tag => ({
  id: faker.random.number({min: 1000, max: 10000}),
  infusionsoft_id: null,
  name: null,
  type: faker.random.arrayElement(tagTypes),
  ...overrides,
})
