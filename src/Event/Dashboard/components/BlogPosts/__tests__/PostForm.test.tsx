import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeBlogPost} from 'Event/Dashboard/components/BlogPosts/__utils__/factory'
import {createHashMap} from 'lib/list'
import {fakeEvent} from 'Event/__utils__/factory'
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
import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {testTemplates} from 'Event/template/__utils__/tester'

const mockPost = axios.post as jest.Mock

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

testTemplates('should submit a post with a form', async (fakeTemplate) => {
  const action = fakeAction()

  const option = fakeOption({
    action_id: action.id,
  })

  const question = fakeQuestion({
    options: [option],
    type: RADIO,
  })

  const buttons = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    fakeNavButton,
  )

  const form = fakeForm({
    questions: [question],
  })

  const post = fakeBlogPost({
    formId: form.id,
    attachment: 'form',
    buttons: createHashMap(buttons),
  })

  const event = fakeEvent({
    template: fakeTemplate({
      blogPosts: createHashMap([post]),
    }),
    forms: [form],
  })

  const {findByText, queryByText} = await loginToEventSite({
    actions: [action],
    attendee: fakeAttendee({
      has_password: true,
      waiver: faker.internet.url(),
      tech_check_completed_at: 'now',
    }),
    event,
  })

  expect(await findByText(post.title)).toBeInTheDocument()

  expect(queryByText('blog button')).not.toBeInTheDocument()

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
