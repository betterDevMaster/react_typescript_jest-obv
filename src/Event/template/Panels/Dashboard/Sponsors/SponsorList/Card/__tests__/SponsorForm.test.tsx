import user from '@testing-library/user-event'
import faker from 'faker'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeEvent, fakeFaq, fakeSponsor} from 'Event/__utils__/factory'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {
  fakeOption,
  fakeQuestion,
} from 'organization/Event/QuestionsProvider/__utils__/factory'
import {RADIO} from 'organization/Event/QuestionsProvider'
import axios from 'axios'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should submit a sponsor form', async () => {
  const faqs = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeFaq,
  )

  const action = fakeAction()

  const option = fakeOption({
    action_id: action.id,
  })

  const question = fakeQuestion({
    options: [option],
    type: RADIO,
  })

  const form = fakeForm({
    questions: [question],
  })

  const sponsor = fakeSponsor({
    form: form,
  })

  const event = fakeEvent({
    template: fakePanels(),
    forms: [form],
  })

  const {findByText, findByLabelText} = await loginToEventSite({
    actions: [action],
    attendee: fakeAttendee({
      has_password: true,
      waiver: faker.internet.url(),
      tech_check_completed_at: 'now',
    }),
    event,
    beforeLogin: () => {
      mockGet.mockImplementationOnce(() => Promise.resolve({data: faqs}))
      mockGet.mockImplementationOnce(() => Promise.resolve({data: [sponsor]}))
    },
  })

  user.click(await findByLabelText('panels tab sponsors'))
  user.click(await findByLabelText('sponsor questions'))

  user.click(await findByText(option.value))

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: [
        // Mock answer
        {
          question_id: question.id,
          value: option.value,
        },
      ],
    }),
  )

  // received points
  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByText(/submit/i))

  // received points -- ie. show points pop-up
  expect(await findByText(new RegExp(action.description))).toBeInTheDocument()
})
