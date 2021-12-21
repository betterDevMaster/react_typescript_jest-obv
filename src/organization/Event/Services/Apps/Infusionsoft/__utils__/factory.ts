import {
  ATTENDEE_CREATED,
  ATTENDEE_CHECKED_IN,
  ATTENDEE_SIGNED_WAIVER,
  InfusionsoftIntegration,
  Tag,
  TagType,
  IMPORT_TAG,
} from 'organization/Event/Services/Apps/Infusionsoft'
import faker from 'faker'
import {INFUSIONSOFT} from 'organization/Event/Services/ServicesProvider'

export const fakeInfusionsoftIntegration = (
  overrides?: Partial<InfusionsoftIntegration>,
): InfusionsoftIntegration => ({
  service: INFUSIONSOFT,
  has_completed_setup: faker.random.boolean(),
  can_import_attendees: faker.random.boolean(),
  has_set_import_tag: false,
  is_linked: faker.random.boolean(),
  login_field_name: null,
  login_field_label: null,
  tags: tagTypes.map((type) => fakeTag({type})),
  groups: [],
  ...overrides,
})

export const tagTypes: TagType[] = [
  IMPORT_TAG,
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
