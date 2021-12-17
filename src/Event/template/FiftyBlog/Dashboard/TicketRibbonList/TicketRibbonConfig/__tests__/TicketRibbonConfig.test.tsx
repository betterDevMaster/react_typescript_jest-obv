import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import axios from 'axios'
import {fakeTicketRibbon} from 'Event/template/FiftyBlog/Dashboard/TicketRibbonList/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fakeCustomRibbon} from 'organization/Event/DashboardConfig/TicketRibbonUpload/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'

const mockPost = axios.post as jest.Mock
const mockDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should add a custom ticket ribbon', async () => {
  const customRibbon = fakeCustomRibbon()

  const event = fakeEvent({
    template: fakeFiftyBlog({
      ticketRibbons: [],
    }),
  })

  const {
    findByLabelText,
    findAllByLabelText,
    findByText,
  } = await goToDashboardConfig({
    event,
  })
  window.URL.createObjectURL = jest.fn(() => 'blob://croppedimage')

  user.click(await findByLabelText(/add ticket ribbon/i))

  const image = new File([], 'image.jpg')
  const letterUploadInput = (await findAllByLabelText('upload custom image'))[0]
  Object.defineProperty(letterUploadInput, 'files', {
    value: [image],
  })
  fireEvent.change(letterUploadInput)

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
})

it('should remove a custom image on delete', async () => {
  const customRibbon = fakeCustomRibbon()
  const ticketRibbon = fakeTicketRibbon({
    letterUpload: customRibbon,
  })

  const event = fakeEvent({
    template: fakeFiftyBlog({
      ticketRibbons: [ticketRibbon],
    }),
  })

  const {findByText} = await goToDashboardConfig({event})

  user.click(await findByText(ticketRibbon.letter))

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'deleted'}))

  user.click(await findByText(/remove/i))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  const [url] = mockDelete.mock.calls[0]

  expect(url).toMatch(`/ticket_ribbons/${customRibbon.id}`)
})

it('should handle a failed custom delete', async () => {
  const ribbon = fakeTicketRibbon({
    letterUpload: {
      id: 10,
      image: {
        name: 'customticket',
        url: 'http://customticket.jpg',
      },
    },
  })

  const event = fakeEvent({
    template: fakeFiftyBlog({
      ticketRibbons: [ribbon],
    }),
  })

  const {findByLabelText, queryByText, findByText} = await goToDashboardConfig({
    event,
  })

  user.click(await findByText(ribbon.letter))

  mockDelete.mockImplementationOnce(() => Promise.reject('missing ribbon'))

  fireEvent.click(await findByLabelText('remove ticket ribbon'))

  // Target ribbon was still removed anyway
  await wait(() => {
    expect(queryByText(ribbon.letter)).not.toBeInTheDocument()
  })
})
