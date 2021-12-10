import {testTemplates} from 'Event/template/__utils__/tester'
import {fakeBlogPost} from 'Event/Dashboard/components/BlogPosts/__utils__/factory'
import user from '@testing-library/user-event'
import {createHashMap} from 'lib/list'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {fakeEvent} from 'Event/__utils__/factory'
import axios from 'axios'
import {fireEvent, wait} from '@testing-library/dom'
import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {REMOVE} from 'Event/TemplateUpdateProvider'

const mockPut = axios.put as jest.Mock

testTemplates('should add a blog post button', async (fakeTemplate) => {
  const post = fakeBlogPost({
    attachment: 'buttons',
  })

  const event = fakeEvent({
    template: fakeTemplate({
      blogPosts: createHashMap([post]),
    }),
  })

  const {findByText, findAllByLabelText} = await goToDashboardConfig({
    event,
  })

  user.click(await findByText(/add button/i))

  expect((await findAllByLabelText('blog post button')).length).toBe(1)

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/template`)

  const values = Object.values(data.template)

  // Assert includes new button via default butotn text
  expect(values.includes('Button')).toBe(true) // Default button text
})

testTemplates('should edit a post button', async (fakeTemplate) => {
  const button = fakeNavButton()
  const buttons = createHashMap([button])

  const post = fakeBlogPost({
    attachment: 'buttons',
    buttons,
  })

  const event = fakeEvent({
    template: fakeTemplate({
      blogPosts: createHashMap([post]),
    }),
  })

  const {findByText, findByLabelText} = await goToDashboardConfig({
    event,
  })

  const buttonEl = await findByText(button.text)
  clickEdit(buttonEl)

  const textInput = (await findByLabelText(
    'button name input',
  )) as HTMLInputElement

  const newText = 'updated text'

  fireEvent.change(textInput, {
    target: {
      value: newText,
    },
  })

  fireEvent.click(await findByLabelText('save'))

  const updatedEl = await findByText(newText)
  expect(updatedEl).toBeInTheDocument()

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/template`)

  const values = Object.values(data.template)

  expect(values.includes(newText)).toBe(true)
})

testTemplates('should remove a blog post button', async (fakeTemplate) => {
  // start with 3 buttons
  const buttons = createHashMap([
    fakeNavButton(),
    fakeNavButton(),
    fakeNavButton(),
  ])

  const targetId = Object.keys(buttons)[1] // remove 2nd button
  const target = buttons[targetId]

  const post = fakeBlogPost({
    attachment: 'buttons',
    buttons,
  })
  const blogPosts = createHashMap([post])

  const event = fakeEvent({
    template: fakeTemplate({
      blogPosts,
    }),
  })

  const {findByText, findAllByLabelText} = await goToDashboardConfig({
    event,
  })

  const buttonEl = await findByText(target.text)
  clickEdit(buttonEl)

  fireEvent.click(await findByText(/remove button/i))

  // Removed 1 button = 2 left
  expect((await findAllByLabelText('blog post button')).length).toBe(2)

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/template`)

  const postId = Object.keys(blogPosts)[0]

  expect(data.template[`blogPosts.${postId}.buttons.${targetId}`]).toBe(REMOVE)
})
