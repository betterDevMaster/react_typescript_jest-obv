import {createLanguage, ENGLISH} from './../LanguageProvider/language'
import {ObvioEvent} from 'Event'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {Entry} from 'Event/Leaderboard'
import {Speaker} from 'Event/SpeakerPage'
import {Sponsor} from 'Event/SponsorPage'
import {FAQ} from 'Event/FaqPage'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import faker from 'faker'
import {now} from 'lib/date-time'

export const fakeEvent = (overrides?: Partial<ObvioEvent>): ObvioEvent => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: faker.company.companyName(),
  slug: faker.internet.domainWord(),
  start: now(),
  end: faker.date.future().toISOString(),
  has_ended: false,
  num_attendees: 10,
  template: fakeSimpleBlog(),
  speakers: [],
  waiver: fakeWaiver(),
  tech_check: fakeTechCheck(),
  logo: null,
  welcome_image: null,
  header_background: null,
  points_summary_logo: null,
  platform_actions: createPlatformActions(),
  login_background: null,
  login_logo: null,
  favicon: null,
  dashboard_background: null,
  sidebar_background: null,
  footer_image: null,
  forms: [],
  has_infusionsoft: false,
  sponsor_page_title: 'Our Sponsors',
  sponsor_question_icon: null,
  localization: null,
  domains: [],
  zoom_backgrounds_title: null,
  zoom_backgrounds_description: null,
  backgrounds: [],
  ticket_ribbons: [],
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
    visit_speakers: null,
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
    is_enabled: true,
    form: null,
    agree_statement: faker.lorem.paragraphs(),
    signature_prompt: faker.lorem.paragraphs(),
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
    start: now(),
    is_enabled: true,
    area_key: faker.random.alphaNumeric(16),
    additional_content: null,
    ...overrides,
  }
}

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

export const fakeSponsor = (overrides?: Partial<Sponsor>): Sponsor => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  description: `<html><p>${faker.lorem.paragraphs(3)}</p></html>`,
  image: null,
  settings: null,
  form: null,
  ...overrides,
})

export const fakeFaq = (overrides?: Partial<FAQ>): FAQ => ({
  id: faker.random.number({min: 1000, max: 10000}),
  question: `${faker.name.firstName()} ${faker.name.lastName()}`,
  answer: `<html><p>${faker.lorem.paragraphs(3)}</p></html>`,
  settings: {
    showAnswerOnLoad: false,
    rules: [],
  },
  ...overrides,
})

export const fakeLocalization = (
  overrides?: Partial<ObvioEvent['localization']>,
): ObvioEvent['localization'] => ({
  languages: [createLanguage(ENGLISH)],
  defaultLanguage: null,
  translations: {},
  ...overrides,
})
