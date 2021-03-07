import {act, findByText, fireEvent, wait} from '@testing-library/react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import axios from 'axios'
import {Await} from 'lib/type-utils'
import {fakeQuestion} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {
  CHECKBOX,
  LONG_ANSWER_TEXT,
  Question,
  RADIO,
  SELECT,
  SHORT_ANSWER_TEXT,
} from 'organization/Event/QuestionsProvider'
import {fakeEvent} from 'Event/__utils__/factory'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock

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
    is_registration_question: true,
  })

  const longAnswerQuestion = fakeQuestion({
    type: LONG_ANSWER_TEXT,
    is_registration_question: true,
  })

  const radioQuestion = fakeQuestion({
    type: RADIO,
    is_registration_question: true,
    options: Array.from(
      {length: faker.random.number({min: 1, max: 5})},
      () => `radio ${faker.random.word()}`,
    ),
  })

  const selectQuestion = fakeQuestion({
    type: SELECT,
    is_registration_question: true,
    options: Array.from(
      {length: faker.random.number({min: 1, max: 5})},
      () => `select ${faker.random.word()}`,
    ),
  })

  const checkboxQuestion = fakeQuestion({
    type: CHECKBOX,
    is_registration_question: true,
    options: Array.from(
      {length: faker.random.number({min: 1, max: 5})},
      () => `checkbox ${faker.random.word()}`,
    ),
  })

  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })

  const event = fakeEvent({
    questions: [
      shortAnswerQuestion,
      longAnswerQuestion,
      radioQuestion,
      selectQuestion,
      checkboxQuestion,
    ],
  })

  const context = await loginToEventSite({
    attendee,
    event,
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

  expect(url).toMatch(`/events/${event.slug}/questions/submissions`)

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
})

async function submitWaiver({
  findByLabelText,
}: Await<ReturnType<typeof loginToEventSite>>) {
  const canvas = ((await findByLabelText(
    'signature canvas',
  )) as unknown) as HTMLCanvasElement

  const signature = 'data:image/png;base64'
  //@ts-ignore
  canvas.toDataURL.mockReturnValueOnce(signature) // mocked via jest-canvas-mock

  const down = new MouseEvent('mousedown', {
    button: 1,
    bubbles: true,
  })

  Object.defineProperty(down, 'which', {
    value: 1,
  })

  fireEvent(canvas, down)

  const up = new MouseEvent('mouseup', {
    button: 1,
    bubbles: true,
  })

  // Have to manually set 'which' because that's what SignaturePad uses
  // to check the mouse button
  Object.defineProperty(up, 'which', {
    value: 1,
  })

  fireEvent(canvas, up)

  fireEvent.click(await findByLabelText('agree to waiver checkbox'))

  const withWaver = fakeAttendee({
    has_password: true,
    waiver: 'waiver.jpg',
  })
  mockPost.mockImplementationOnce(() => Promise.resolve({data: withWaver}))

  fireEvent.click(await findByLabelText('submit'))

  const techCheckUrl = faker.internet.url()
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: {url: techCheckUrl}}),
  )
}
