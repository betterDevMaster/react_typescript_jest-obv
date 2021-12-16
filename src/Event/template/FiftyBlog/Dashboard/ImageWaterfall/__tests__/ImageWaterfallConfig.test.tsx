import {goToImageEntries} from 'organization/Event/ImageEntries/__utils__/go-to-image-entries'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/dom'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should update image waterfall config', async () => {
  const {findByText, findByLabelText, event} = await goToImageEntries({
    event: fakeEvent({
      template: fakeFiftyBlog(),
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
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}`)

  expect(data.template['imageWaterfall.title']).toBe(title) // did save config data
})
