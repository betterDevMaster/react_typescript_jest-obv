import {fakeAttendee} from 'Event/auth/__utils__/factory'
import axios from 'axios'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {createEntityList} from 'lib/list'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/dom'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'

const mockPost = axios.post as jest.Mock

it('should upload an image', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo') // required for image uploads

  const buttonText = 'upload image'

  const {findAllByText, findByLabelText} = await loginToEventSite({
    attendee: fakeAttendee({
      waiver: 'some.pdf',
      tech_check_completed_at: 'now',
      has_password: true,
    }),
    event: fakeEvent({
      template: fakePanels({
        nav: createEntityList([
          fakeNavButtonWithSize({
            text: buttonText,
            isImageUpload: true,
          }),
        ]),
      }),
    }),
  })

  user.click((await findAllByText(buttonText))[0])

  const image = new File([], 'myimage.png', {
    type: 'image/png',
  })
  const input = await findByLabelText('image upload')
  const filePath = 'somegeneratedfilepath.jpeg'

  fireEvent.change(input, {
    target: {
      files: [image],
    },
  })

  // Server responds with file path
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        file: filePath,
      },
    }),
  )

  user.click(await findByLabelText('upload image'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  const [url, data] = mockPost.mock.calls[1]

  expect(url).toMatch('/image_entries')
  expect(data.get('image')).toBe(image)
})
