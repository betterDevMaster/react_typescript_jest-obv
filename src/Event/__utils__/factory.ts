import {ObvioEvent, Speaker} from 'Event'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {Entry} from 'Event/Leaderboard'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import faker from 'faker'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'

export const fakeEvent = (overrides?: Partial<ObvioEvent>): ObvioEvent => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: faker.company.companyName(),
  slug: faker.internet.domainWord(),
  template: fakeSimpleBlog(),
  speaker_page: {title: 'SPEAKERS', speakers: []},
  waiver: fakeWaiver(),
  tech_check: fakeTechCheck(),
  logo: null,
  header_background: null,
  points_summary_logo: null,
  platform_actions: createPlatformActions(),
  login_background: null,
  login_logo: null,
  questions: [],
  ...overrides,
})

export function createPlatformActions(
  overrides?: Partial<ObvioEvent['platform_actions']>,
) {
  return {
    create_password: null,
    complete_check_in: null,
    visit_dashboard: null,
    download_resource: null,
    visit_leaderboard: null,
    ...overrides,
  }
}

export function fakeWaiver(
  overrides?: Partial<ObvioEvent['waiver']>,
): ObvioEvent['waiver'] {
  return {
    logo: faker.random.alphaNumeric(10) + '.png',
    title: faker.company.companyName(),
    body: `<html><h1>${faker.company.bsNoun()} Waiver</h1><p>${faker.lorem.paragraphs(
      3,
    )}</p></html>`,
    ...overrides,
  }
}

export function fakeTechCheck(
  overrides?: Partial<ObvioEvent['tech_check']>,
): ObvioEvent['tech_check'] {
  return {
    body: `<html><h1>${faker.company.bsNoun()} Tech Check</h1><p>${faker.lorem.paragraphs(
      3,
    )}</p></html>`,
    is_enabled: true,
    area: fakeArea(),
    ...overrides,
  }
}

export const fakeSpeakerPage = (
  overrides?: Partial<ObvioEvent['speaker_page']>,
): ObvioEvent['speaker_page'] => ({
  title: `Speakers ${faker.random.words(3)}`,
  speakers: [],
  ...overrides,
})

export const fakeSpeaker = (overrides?: Partial<Speaker>): Speaker => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  text: `<html><p>${faker.lorem.paragraphs(3)}</p></html>`,
  image: null,
  ...overrides,
})

export const fakeEntry = (overrides?: Partial<Entry>): Entry => ({
  attendee: fakeAttendee(),
  score: faker.random.number({min: 1000, max: 5000}),
  ...overrides,
})
