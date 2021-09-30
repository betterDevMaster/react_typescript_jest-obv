import {fakeAttendee} from 'Event/auth/__utils__/factory'
import axios from 'axios'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createEntityList} from 'lib/list'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/dom'

const mockPost = axios.post as jest.Mock

it('should upload an image', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo') // required for image uploads

  const buttonText = 'upload image'

  const {findByText, findByLabelText} = await loginToEventSite({
    attendee: fakeAttendee({
      waiver: 'some.pdf',
      tech_check_completed_at: 'now',
      has_password: true,
    }),
    event: fakeEvent({
      template: fakeSimpleBlog({
        mainNav: createEntityList([
          fakeNavButtonWithSize({
            text: buttonText,
            isFormButton: true,
          }),
        ]),
      }),
    }),
  })

  user.click(await findByText(buttonText))

  const image = new File([], 'myimage.jpg')
  const input = await findByLabelText('image input')
  Object.defineProperty(input, 'files', {
    value: [image],
  })

  fireEvent.change(input)

  user.click(await findByLabelText('cancel image resize'))

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'})) // don't actually care about returned entry

  user.click(await findByLabelText('upload image'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  const [url, data] = mockPost.mock.calls[1]

  expect(url).toMatch('/image_entries')
  expect(data.get('image')).toBe(image)
})
