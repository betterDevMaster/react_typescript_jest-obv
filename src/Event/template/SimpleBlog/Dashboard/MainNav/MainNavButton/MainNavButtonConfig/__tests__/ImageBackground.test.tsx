import user from '@testing-library/user-event'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeNavButtonWithSize} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import mockAxios from 'axios'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'

const mockPost = axios.post as jest.Mock
const mockRxPost = mockRxJsAjax.post as jest.Mock
const mockGet = mockAxios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should configure background image', async () => {
  window.URL.createObjectURL = jest.fn(() => 'blob://foo')

  const button = fakeNavButtonWithSize()
  const event = fakeEvent({
    template: fakeSimpleBlog({
      mainNav: createEntityList([button]),
    }),
    has_infusionsoft: true,
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  const buttonEl = await findByText(button.text)

  const name = faker.random.word()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {name}}))

  clickEdit(buttonEl)

  const image = new File([], 'buttonbg.jpg')
  const imageInput = await findByLabelText('upload background image')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })

  const file = {
    url: 'https://s3.obv.io/mybutton.jpg',
    name: 'mybutton.jpg',
  }

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        file,
      },
    }),
  )

  fireEvent.change(imageInput)

  user.click(await findByLabelText('cancel image resize'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  user.click(await findByLabelText('save'))

  // Saved
  await wait(() => {
    expect(mockRxPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockRxPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  const saved = Object.values(data.template.mainNav.entities)[0] as any

  expect(saved.backgroundColor).toBe(`url(${file.url})`)
})
