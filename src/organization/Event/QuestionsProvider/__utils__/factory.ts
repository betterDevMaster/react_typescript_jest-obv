import {
  ALPHA_NUMERIC,
  CHECKBOX,
  EMAIL,
  LONG_ANSWER_TEXT,
  NUMERIC,
  PHONE_NUMBER,
  Question,
  QuestionType,
  RADIO,
  SELECT,
  SHORT_ANSWER_TEXT,
} from 'organization/Event/QuestionsProvider'
import faker from 'faker'

export const QUESTION_TYPES: QuestionType[] = [
  SHORT_ANSWER_TEXT,
  LONG_ANSWER_TEXT,
  RADIO,
  SELECT,
  CHECKBOX,
]

export const randomType = () => faker.random.arrayElement(QUESTION_TYPES)

export const VALIDATION_RULES = [EMAIL, PHONE_NUMBER, ALPHA_NUMERIC, NUMERIC]

export const randomRule = () => faker.random.arrayElement(VALIDATION_RULES)

export const fakeQuestion = (overrides?: Partial<Question>): Question => ({
  id: faker.random.number({min: 1000, max: 10000}),
  label: faker.random.words(3),
  helper_text: faker.lorem.sentence(),
  is_required: faker.random.boolean(),
  allows_multiple_options: faker.random.boolean(),
  type: randomType(),
  options: [],
  validation_rule: null,
  is_registration_question: faker.random.boolean(),
  ...overrides,
})

export function typeLabel(name: string) {
  const labels: Record<string, string> = {
    [SHORT_ANSWER_TEXT]: 'Short Answer Text',
    [LONG_ANSWER_TEXT]: 'Long Answer Text',
    [RADIO]: 'Radio',
    [SELECT]: 'Select',
    [CHECKBOX]: 'Checkbox',
  }

  const label = labels[name]
  if (!label) {
    throw new Error(`Label not defined for type: ${name}`)
  }

  return label
}

export function ruleLabel(name: string) {
  const labels: Record<string, string> = {
    email: 'Email',
    phone_number: 'Phone Number',
    alpha_numeric: 'Alphanumeric',
    numeric: 'Number',
  }

  const label = labels[name]
  if (!label) {
    throw new Error(`Label not defined for rule: ${name}`)
  }

  return label
}