import {
  ADD_ATTENDEE,
  ATTENDEE_ADDED,
  ATTENDEE_CHECKED_IN,
  ATTENDEE_SIGNED_WAIVER,
  DELETE_ATTENDEE,
  InfusionsoftIntegration,
  Tag,
  TagType,
  UPDATE_ATTENDEE,
} from 'organization/Event/Services/Infusionsoft'
import faker from 'faker'
import {INFUSIONSOFT} from 'organization/Event/Services/ServicesProvider'

export const fakeInsusionsoftIntegration = (
  overrides?: Partial<InfusionsoftIntegration>,
): InfusionsoftIntegration => ({
  service: INFUSIONSOFT,
  has_completed_setup: faker.random.boolean(),
  is_linked: faker.random.boolean(),
  ...overrides,
})

export const tagTypes: TagType[] = [
  ADD_ATTENDEE,
  UPDATE_ATTENDEE,
  DELETE_ATTENDEE,
  ATTENDEE_ADDED,
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
