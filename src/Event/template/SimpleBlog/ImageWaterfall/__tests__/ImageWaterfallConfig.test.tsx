import {goToImageEntries} from 'organization/Event/ImageEntries/__utils__/go-to-image-entries'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/dom'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'

const mockPost = mockRxJsAjax.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update image waterfall config', async () => {
  const {findByText, findByLabelText, event} = await goToImageEntries({
    event: fakeEvent({
      template: fakeSimpleBlog(),
    }),
  })

  user.click(await findByText(/image waterfall settings/i))

  const title = 'new titel'

  fireEvent.change(await findByLabelText('title'), {
    target: {
      value: title,
    },
  })

  user.click(await findByLabelText('save'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template.imageWaterfall.title).toBe(title) // did save config data
})
