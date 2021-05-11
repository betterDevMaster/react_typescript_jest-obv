import {act, fireEvent, wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import axios from 'axios'
import {fakeQuestion} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {
  CHECKBOX,
  LONG_ANSWER_TEXT,
  Question,
  RADIO,
  SELECT,
  SHORT_ANSWER_TEXT,
} from 'organization/Event/QuestionsProvider'
import {fakeEvent, fakeWaiver} from 'Event/__utils__/factory'
import {submitWaiver} from 'Event/Step2/__utils__/submit-waiver'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'

const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show step 2 on login', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })
  const {findByLabelText} = await loginToEventSite({attendee})

  expect(await findByLabelText('signature canvas')).toBeInTheDocument()
})

it('should submit attendee waiver', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })

  const context = await loginToEventSite({attendee})

  await act(async () => {
    await submitWaiver(context)
  })

  // Moved on to next step
  await wait(async () => {
    expect(context.queryByLabelText('signature canvas')).not.toBeInTheDocument()
  })
})

it('should submit answers', async () => {
  const shortAnswerQuestion = fakeQuestion({
    type: SHORT_ANSWER_TEXT,
  })

  const longAnswerQuestion = fakeQuestion({
    type: LONG_ANSWER_TEXT,
  })

  const radioQuestion = fakeQuestion({
    type: RADIO,
    options: new Array(faker.random.number({min: 1, max: 4}))
      .fill(null)
      .map((_, index) => `radio ${index} ${faker.random.word()}`),
  })

  const radioOtherQuestion = fakeQuestion({
    type: RADIO,
    options: new Array(faker.random.number({min: 1, max: 4}))
      .fill(null)
      .map((_, index) => `radio ${index} ${faker.random.word()}`),
    has_other_option: true,
  })

  const selectQuestion = fakeQuestion({
    type: SELECT,
    options: new Array(faker.random.number({min: 1, max: 4}))
      .fill(null)
      .map((_, index) => `select ${index} ${faker.random.word()}`),
  })

  const checkboxQuestion = fakeQuestion({
    type: CHECKBOX,
    options: new Array(faker.random.number({min: 1, max: 4}))
      .fill(null)
      .map((_, index) => `checkbox ${index} ${faker.random.word()}`),
  })

  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })

  const form = fakeForm({
    questions: [
      shortAnswerQuestion,
      longAnswerQuestion,
      radioQuestion,
      radioOtherQuestion,
      selectQuestion,
      checkboxQuestion,
    ],
  })

  const event = fakeEvent({
    forms: [form],
    waiver: fakeWaiver({form}),
  })

  const context = await loginToEventSite({
    attendee,
    event,
    submissions: [],
  })

  const {findByLabelText, findByText} = context

  // Answer short answer question
  const shortAnswer = faker.random.words(3)
  user.type(await findByLabelText(shortAnswerQuestion.label), shortAnswer)

  // Answer long anser question
  const longAnswer = faker.lorem.paragraph()
  user.type(await findByLabelText(longAnswerQuestion.label), longAnswer)

  // Select a radio
  const radioOption = faker.random.arrayElement(radioQuestion.options)
  user.click(await findByText(radioOption))

  // Set an other option
  const otherValue = faker.random.word()
  user.click(await findByText('Other'))
  user.type(await findByLabelText('other value'), otherValue)

  // Select dropdown select option
  const selectOption = faker.random.arrayElement(selectQuestion.options)
  fireEvent.mouseDown(await findByLabelText(selectQuestion.label))
  user.click(await findByText(selectOption))

  // select all checkboxes
  for (const option of checkboxQuestion.options) {
    user.click(await findByLabelText(option))
  }

  // answers
  mockPost.mockImplementationOnce(() => Promise.resolve({data: []}))

  await act(async () => {
    await submitWaiver(context)
  })

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(3)
  })

  const [url, data] = mockPost.mock.calls[1]

  expect(url).toMatch(`/forms/${form.id}/submissions`)

  const {answers} = data

  const submission = (question: Question) =>
    answers.find((a: any) => a.question_id === String(question.id))

  expect(submission(shortAnswerQuestion).value).toBe(shortAnswer)
  expect(submission(longAnswerQuestion).value).toBe(longAnswer)
  expect(submission(radioQuestion).value).toBe(radioOption)
  expect(submission(selectQuestion).value).toBe(selectOption)
  // Selected all checkbox options...
  expect(submission(checkboxQuestion).value).toBe(
    checkboxQuestion.options.join(', '),
  )
  // Saved 'other' radio input value
  expect(submission(radioOtherQuestion).value).toBe(otherValue)
})
