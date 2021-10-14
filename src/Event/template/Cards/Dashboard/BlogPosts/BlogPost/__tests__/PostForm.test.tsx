import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakeBlogPost} from 'Event/Dashboard/components/BlogPost/__utils__/factory'
import {createEntityList} from 'lib/list'
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

it('should submit a post with a form', async () => {
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

  const post = fakeBlogPost({
    formId: form.id,
  })

  const event = fakeEvent({
    template: fakeCards({
      blogPosts: createEntityList([post]),
    }),
    forms: [form],
  })

  const {findByText} = await loginToEventSite({
    actions: [action],
    attendee: fakeAttendee({
      has_password: true,
      waiver: faker.internet.url(),
      tech_check_completed_at: 'now',
    }),
    event,
  })

  expect(await findByText(post.title)).toBeInTheDocument()

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
