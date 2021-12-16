import faker from 'faker'
import {fakeEvent} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import axios from 'axios'
import {clickEdit} from '__utils__/edit'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'

const mockPost = axios.post as jest.Mock
const mockDelete = axios.delete as jest.Mock

it('should upload an image', async () => {
  window.URL.createObjectURL = jest.fn()

  const event = fakeEvent({
    template: fakeFiftyBlog({
      emojiList: {
        emojis: [],
      },
    }),
  })

  const {findByLabelText, findAllByLabelText} = await goToDashboardConfig({
    event,
  })

  user.click(await findByLabelText('add emoji list'))

  const image = new File([], 'myemoji.jpg')
  const imageInput = await findByLabelText('emoji upload input')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })
  fireEvent.change(imageInput)

  const file = `${faker.random.alphaNumeric()}.jpg`
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        file,
      },
    }),
  )

  user.click(await findByLabelText('upload emoji'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [_, data] = mockPost.mock.calls[0]
  expect(data.get('file')).toBe(image)

  const emojiSelects = await findAllByLabelText('pick emoji')

  // Adds a new picker
  expect(emojiSelects.length).toBe(2)

  // Sets image source in first picker
  const imgEl = emojiSelects[0].children[0]
  expect(imgEl.getAttribute('src')).toMatch(new RegExp(file))
})

it('should remove the emoji file', async () => {
  window.URL.createObjectURL = jest.fn()

  const customEmoji = `${faker.random.alphaNumeric()}.jpg`

  const event = fakeEvent({
    template: fakeFiftyBlog({
      emojiList: {
        emojis: [customEmoji],
      },
    }),
  })

  const {findByLabelText, findAllByLabelText} = await goToDashboardConfig({
    event,
  })

  clickEdit(await findByLabelText('emoji list'))

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  fireEvent.click((await findAllByLabelText('remove emoji'))[0])

  expect(mockDelete).toHaveBeenCalledTimes(1)
  const [url] = mockDelete.mock.calls[0]

  // Sent a delete request for custom emoji file
  expect(url).toMatch(new RegExp(customEmoji))
})

it('it should cancel an emoji upload', async () => {
  const data = faker.random.alphaNumeric(10)
  window.URL.createObjectURL = jest.fn(() => data)

  const event = fakeEvent({
    template: fakeFiftyBlog({
      emojiList: {
        emojis: [],
      },
    }),
  })

  const {findByLabelText, queryByLabelText} = await goToDashboardConfig({event})

  user.click(await findByLabelText('add emoji list'))

  const image = new File([], 'myemoji.jpg')
  const imageInput = await findByLabelText('emoji upload input')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })
  fireEvent.change(imageInput)

  expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1)

  // Image preview set with data
  const previewImage = await findByLabelText('emoji preview')
  expect(previewImage.getAttribute('src')).toMatch(new RegExp(data))

  user.click(await findByLabelText('cancel upload'))

  // preview removed
  await wait(() => {
    expect(queryByLabelText('emoji preview')).not.toBeInTheDocument()
  })
})
