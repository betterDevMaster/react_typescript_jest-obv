import faker from 'faker'
import {fakeEvent, fakeFaq} from 'Event/__utils__/factory'
import axios from 'axios'
import user from '@testing-library/user-event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {goToFaqConfig} from 'Event/template/SimpleBlog/FaqPage/FaqPageConfig/__utils__/go-to-faq-page-config'
import {wait} from '@testing-library/react'

const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should add a faq', async () => {
  const numFaqs = faker.random.number({min: 2, max: 5})

  const faqs = Array.from({length: numFaqs}, () => fakeFaq())

  const event = fakeEvent()
  const {findByText, findByLabelText} = await goToFaqConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
    faqs,
  })

  for (const faq of faqs) {
    expect(await findByText(faq.question)).toBeInTheDocument()
  }

  const newFaq = fakeFaq()

  mockPost.mockImplementationOnce(() => Promise.resolve({data: newFaq}))

  user.click(await findByLabelText('add faq'))
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  user.click(await findByLabelText('close dialog'))

  expect(await findByText(newFaq.question)).toBeInTheDocument()
})
