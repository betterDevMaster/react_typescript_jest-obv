import {fireEvent, wait} from '@testing-library/react'
import faker from 'faker'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import axios from 'axios'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {AwaitExpression} from 'typescript'
import {Await} from 'lib/type-utils'
import {Attendee} from 'Event/attendee'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show step 2 on login', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })
  const {findByLabelText} = await loginToEventSite({attendee})

  expect(await findByLabelText('signature canvas')).toBeInTheDocument()
})

it('should submit attendee waiver', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })

  const context = await loginToEventSite({attendee})

  await submitWaiver(context)

  // Moved on to next step
  await wait(async () => {
    expect(context.queryByLabelText('signature canvas')).not.toBeInTheDocument()
  })
})

it('should received points', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    waiver: null,
  })

  // Submit waiver = action id #2
  const action = fakeAction({id: 2})
  const platformActions = [action]
  const context = await loginToEventSite({
    attendee,
    platformActions,
  })

  const {event} = context

  await submitWaiver(context)

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'got points'}))

  await wait(async () => {
    expect(mockPost).toHaveBeenCalledTimes(3)
  })

  const [url] = mockPost.mock.calls[2]

  expect(url).toMatch(`/events/${event.slug}/actions/2`)

  // show points pop-up
  expect(
    await context.findByText(new RegExp(action.description)),
  ).toBeInTheDocument()
})

async function submitWaiver({
  findByLabelText,
}: Await<ReturnType<typeof loginToEventSite>>) {
  const canvas = ((await findByLabelText(
    'signature canvas',
  )) as unknown) as HTMLCanvasElement

  const signature = 'data:image/png;base64'
  //@ts-ignore
  canvas.toDataURL.mockReturnValueOnce(signature) // mocked via jest-canvas-mock

  const down = new MouseEvent('mousedown', {
    button: 1,
    bubbles: true,
  })

  Object.defineProperty(down, 'which', {
    value: 1,
  })

  fireEvent(canvas, down)

  const up = new MouseEvent('mouseup', {
    button: 1,
    bubbles: true,
  })

  // Have to manually set 'which' because that's what SignaturePad uses
  // to check the mouse button
  Object.defineProperty(up, 'which', {
    value: 1,
  })

  fireEvent(canvas, up)

  fireEvent.click(await findByLabelText('agree to waiver checkbox'))

  const withWaver = fakeAttendee({
    has_password: true,
    waiver: 'waiver.jpg',
  })
  mockPost.mockImplementationOnce(() => Promise.resolve({data: withWaver}))

  fireEvent.click(await findByLabelText('submit waiver button'))

  const techCheckUrl = faker.internet.url()
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: {url: techCheckUrl}}),
  )
}
