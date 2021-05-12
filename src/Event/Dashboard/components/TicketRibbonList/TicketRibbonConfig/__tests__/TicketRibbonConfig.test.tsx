import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import axios from 'axios'
import {
  fakeCustomRibbon,
  fakeTicketRibbon,
} from 'Event/Dashboard/components/TicketRibbonList/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {clickEdit} from '__utils__/edit'

const mockPost = axios.post as jest.Mock
const mockDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should add a custom ticket ribbon', async () => {
  const customRibbon = fakeCustomRibbon()

  const event = fakeEvent({
    template: fakeSimpleBlog({
      ticketRibbons: [],
    }),
  })

  const {findByText, findByLabelText} = await goToDashboardConfig({event})
  window.URL.createObjectURL = jest.fn(() => 'blob://croppedimage')

  user.click(await findByText(/add ticket ribbon/i))

  const image = new File([], 'image.jpg')
  const imageInput = await findByLabelText('upload custom image')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })
  fireEvent.change(imageInput)

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: customRibbon,
    }),
  )

  user.click(await findByLabelText('cancel image resize'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  // Uploaded correct image
  expect(url).toMatch(`/events/${event.slug}/ticket_ribbons`)
  expect(data.get('image')).toBe(image)

  user.click(await findByLabelText('close config dialog'))

  // Background was set correctly
  const ribbon = await findByLabelText('ticket ribbon')
  const background = ribbon.children[0]
  expect(background).toHaveStyle(`background: url(${customRibbon.image.url});`)

  clickEdit(ribbon)

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'deleted'}))

  user.click(await findByLabelText('delete custom ribbon'))

  user.click(await findByLabelText('close config dialog'))

  // Custom background removed
  expect(background).not.toHaveStyle(
    `background: url(${customRibbon.image.url});`,
  )
})

it('should remove a custom image on delete', async () => {
  const customRibbon = fakeCustomRibbon()

  const event = fakeEvent({
    template: fakeSimpleBlog({
      ticketRibbons: [
        fakeTicketRibbon({
          customRibbon,
        }),
      ],
    }),
  })

  const {findByLabelText} = await goToDashboardConfig({event})

  const ribbon = await findByLabelText('ticket ribbon')

  clickEdit(ribbon)

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'deleted'}))

  user.click(await findByLabelText('remove ticket ribbon'))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  const [url] = mockDelete.mock.calls[0]

  expect(url).toMatch(`/ticket_ribbons/${customRibbon.id}`)
})
