import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import faker from 'faker'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should edit post form styles', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog(),
  })
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  user.click(await findByLabelText('style post form'))

  const color = faker.internet.color()
  user.type(await findByLabelText('submit button color'), color)

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [_, data] = mockPost.mock.calls[0]

  expect(data.template.postFormStyles.buttonColor).toBe(color)
})
